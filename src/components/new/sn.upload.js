import React, { useState, useEffect } from "react";
import HttpStatus from "http-status-codes";
import bytes from "bytes";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import classNames from "classnames";
import { setUploadList } from "../../reducers/actions/sn.upload-list.action";
import imageCompression from "browser-image-compression";
import path from "path-browserify";
import Snackbar from "@material-ui/core/Snackbar";
import { useDropzone } from "react-dropzone";
import { DEFAULT_PORTAL } from "../../sn.constants";
import { getCompressedImageFile, generateThumbnailFromVideo } from "../../sn.util";
import "./sn.upload.scss";
import MuiAlert from "@material-ui/lab/Alert";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import { SkynetClient } from "skynet-js";
import UploadFile from "./UploadFile";
import { useSelector, useDispatch } from "react-redux";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnUpload = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();

  const [files, setFiles] = useState([]);
  const [uploadErr, setUploadErr] = useState(false);
  const [isDir, setIsDir] = useState(false);
  const apiUrl = props.portal != null ? props.portal : DEFAULT_PORTAL;

  const client = new SkynetClient(apiUrl);

  useEffect(()=>{
    dispatch(setUploadList(files));
  }, [files]);

  useEffect(() => {
    if (props.directoryMode || isDir) {
      inputRef.current.setAttribute("webkitdirectory", "true");
    } else {
      inputRef.current.removeAttribute("webkitdirectory");
    }
  }, [props.directoryMode, isDir]);

  const videoToImg = async (video) => {
    let canvas = document.createElement("canvas");
    let w = video.videoWidth;
    let h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);
    let file = await imageCompression.canvasToFile(canvas, "image/jpeg");
    return file;
  };

  const getFilePath = (file) =>
    file.webkitRelativePath || file.path || file.name;

  const getRelativeFilePath = (file) => {
    const filePath = getFilePath(file);
    const { root, dir, base } = path.parse(filePath);
    const relative = path
      .normalize(dir)
      .slice(root.length)
      .split(path.sep)
      .slice(1);

    return path.join(...relative, base);
  };

  const getRootDirectory = (file) => {
    const filePath = getFilePath(file);
    const { root, dir } = path.parse(filePath);

    return path.normalize(dir).slice(root.length).split(path.sep)[0];
  };


  const createUploadErrorMessage = (error) => {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    if (error.response) {
      if (error.response.data.message) {
        return `Upload failed with error: ${error.response.data.message}`;
      }

      const statusCode = error.response.status;
      const statusText = HttpStatus.getStatusText(error.response.status);

      return `Upload failed, our server received your request but failed with status code: ${statusCode} ${statusText}`;
    }

    // The request was made but no response was received. The best we can do is detect whether browser is online.
    // This will be triggered mostly if the server is offline or misconfigured and doesn't respond to valid request.
    if (error.request) {
      if (!navigator.onLine) {
        return "You are offline, please connect to the internet and try again";
      }

      // TODO: We should add a note "our team has been notified" and have some kind of notification with this error.
      return "Server failed to respond to your request, please try again later.";
    }

    // TODO: We should add a note "our team has been notified" and have some kind of notification with this error.
    return `Critical error, please refresh the application and try again. ${error.message}`;
  };

  const handleDrop = async (acceptedFiles) => {
    if ((props.directoryMode || isDir) && acceptedFiles.length) {
      const rootDir = getRootDirectory(acceptedFiles[0]); // get the file path from the first file

      acceptedFiles = [
        { name: rootDir, directory: true, files: acceptedFiles },
      ];
    }

    setFiles((previousFiles) => [
      ...acceptedFiles.map((file) => ({ file, status: "uploading" })),
      ...previousFiles,
    ]);

    const onFileStateChange = (file, state) => {
      setFiles((previousFiles) => {
        const index = previousFiles.findIndex((f) => f.file === file);

        return [
          ...previousFiles.slice(0, index),
          {
            ...previousFiles[index],
            ...state,
          },
          ...previousFiles.slice(index + 1),
        ];
      });
    };

    await acceptedFiles.reduce(async (memo , file) => {
      await memo;
      // Reject files larger than our hard limit of 1 GB with proper message
      if (file.size > bytes("1 GB")) {
        onFileStateChange(file, {
          status: "error",
          error: "This file size exceeds the maximum allowed size of 1 GB.",
        });

        return;
      }
      props.onUploadStart && props.onUploadStart();
      const fileType = file.type;
      let resForCompressed = "";
      if (fileType && fileType.startsWith("image")) {
        const compressedFile = await getCompressedImageFile(file);
        resForCompressed = await client.upload(compressedFile);
      }
      if (fileType && fileType.startsWith("video")) {
        const videoThumbnail = await generateThumbnailFromVideo({file});
        resForCompressed = await client.upload(videoThumbnail);
      }
      const onUploadProgress = (progress) => {
        const status = progress === 1 ? "processing" : "uploading";
        onFileStateChange(file, { status, progress });
      };

      const upload = async () => {
        try {
          let response;
          if (file.directory) {
            const directory = file.files.reduce(
              (acc, file) => ({ ...acc, [getRelativeFilePath(file)]: file }),
              {}
            );

            response = await client.uploadDirectory(
              directory,
              encodeURIComponent(file.name),
              { onUploadProgress }
            );
          } else {
            response = await client.upload(file, { onUploadProgress });
          }
          await props.onUpload({
            skylink: response.skylink,
            name: file.name,
            contentType: fileType,
            thumbnail:
            resForCompressed != null ? resForCompressed.skylink : null,
            contentLength: file.size,
          });
          onFileStateChange(file, {
            status: "complete",
            url: client.getDownloadUrl(response.skylink),
          });
          props.onUploadEnd && props.onUploadEnd();
          //send event to parent
        } catch (error) {
          if (
            error.response &&
            error.response.status === HttpStatus.TOO_MANY_REQUESTS
          ) {
            onFileStateChange(file, { progress: -1 });

            return new Promise((resolve) =>
              setTimeout(() => resolve(upload()), 3000)
            );
          }
          onFileStateChange(file, {
            status: "error",
            error: createUploadErrorMessage(error),
          });
          setUploadErr(true);
          props.onUploadEnd && props.onUploadEnd();
        }
      };
      await upload();
    }, undefined);
  };

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop: handleDrop,
  });

  return (
    <React.Fragment>
      <div className="home-upload">
        <div>
          <Grid container spacing={1} direction="row" className="side-padding-0">
            <Grid item xs={12} sm={9}
              className={classNames("home-upload-dropzone", {
                "drop-active": isDragActive,
              })}
              {...getRootProps()}
              ref={ref}
            >
              <span className="home-upload-text">
                <h3>
                <CloudUploadOutlinedIcon /> Upload your {(props.directoryMode || isDir) ? "Directory" : "Files"}
                </h3>
              </span>
            </Grid>
            <Grid item xs={12} sm={3}>
            <div className="float-right upload-dir-switch">
              <FormControlLabel
                className="no-gutters"
                control={
                  <Switch
                    checked={isDir}
                    onChange={(evt) => setIsDir(evt.target.checked)}
                    name="checkedA"
                    className="app-bg-switch"
                  />
                }
                label="Directory"
              />
              </div>
            </Grid>
            <input id="idInp" {...getInputProps()} className="offscreen" />
          </Grid>
        </div>
      </div>
      {files.length > 0 && (
        <div className="home-uploaded-files">
          {files.map((file, i) => {
            return <UploadFile key={i} {...file} />;
          })}
        </div>
      )}
      <Snackbar
        open={uploadErr}
        autoHideDuration={4000}
        onClose={() => setUploadErr(false)}
      >
        <Alert onClose={() => setUploadErr(false)} severity="error">
          Error on upload!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
})


export default SnUpload;