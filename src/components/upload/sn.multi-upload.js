import React, { useRef, useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import { useLocation } from "react-router-dom";
import FormHelperText from "@material-ui/core/FormHelperText";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { SkynetClient, parseSkylink } from "skynet-js";
import Tooltip from "@material-ui/core/Tooltip";
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined";
import { getPortalFromUserSetting, launchSkyLink, setTypeFromFile } from "../../sn.util";
import ChipInput from "material-ui-chip-input";
import { lookupProfile } from "blockstack";
import { getPublicApps } from "../../skynet/sn.api.skynet";
import SnUpload from "../new/sn.upload";
import { getEmptyHistoryObject } from "../new/sn.new.constants";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { encryptContent } from '../../blockstack/utils';
import Grid from "@material-ui/core/Grid";
import { useSelector, useDispatch } from "react-redux";
import {
  bsAddSkylink, bsAddToHistory, bsAddSkylinkFromSkyspaceList,
  getSkySpace, bsPutSkyspaceInShared, bsGetSharedSkyspaceIdxFromSender, bsAddSkylinkOnly, bsAddSkhubListToSkylinkIdx
} from "../../blockstack/blockstack-api";
import {
  createEmptyErrObj,
  getEmptySkylinkObject,
} from "../new/sn.new.constants";
import {
  UPLOAD, APP_BG_COLOR, PUBLIC_IMPORT,
  DEFAULT_PORTAL, PUBLIC_TO_ACC_QUERY_PARAM
} from "../../sn.constants";
import { getCategoryObjWithoutAll } from "../../sn.category-constants";
import { fetchSkyspaceAppCount } from "../../reducers/actions/sn.skyspace-app-count.action";
import UploadProgress from "./UploadProgress/UploadProgress";
import SnAddToSkyspaceModal from "../modals/sn.add-to-skyspace.modal";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    // paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  cardHeader: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  formControl: {
    margin: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  downloadGrid: {
    paddingTop: 20
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SnMultiUpload(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const query = useQuery();

  const [errorObj, setErrorObj] = useState(createEmptyErrObj());
  const [tags, setTags] = useState([]);
  const [skyspaceList, setSkyspaceList] = useState([]);
  const [dnldSkylink, setDnldSkylink] = useState([]);
  const [showPublicToAccModal, setShowPublicToAccModal] = useState(false);
  const uploadEleRef = React.createRef();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const stUserSession = useSelector((state) => state.userSession);
  const stSnSkyspaceList = useSelector((state) => state.snSkyspaceList);
  const stPerson = useSelector((state) => state.person);
  const stUserSetting = useSelector((state) => state.snUserSetting);
  const skyapp = getEmptySkylinkObject();

  useEffect(() => {
    handlePublicToAcc();
  }, [stPerson]);

  useEffect(() => {
    handlePublicToAcc();
  }, []);

  const handlePublicToAcc = () => {
    if (stPerson != null) {
      const publicToAccHash = query.get(PUBLIC_TO_ACC_QUERY_PARAM);
      if (publicToAccHash != null) {
        setShowPublicToAccModal(true);
      }
    }
  }

  const onUpload = async (uploadObj) => {
    if (stPerson) {
      const app = { ...getEmptySkylinkObject(), ...uploadObj };
      app.tags = tags;
      app.skyspaceList = skyspaceList;
      setTypeFromFile(app.contentType, app)
      const skhubId = await bsAddSkylink(stUserSession, app, stPerson);
      skyspaceList && skyspaceList.length > 0 && await bsAddSkylinkFromSkyspaceList(stUserSession, skhubId, skyspaceList);
      dispatch(fetchSkyspaceAppCount());
      let historyObj = { ...getEmptyHistoryObject(), ...app };
      historyObj.fileName = app.name;
      historyObj.action = UPLOAD;
      historyObj.skyspaces = app.skyspaceList;
      historyObj.savedToSkySpaces = skyspaceList && skyspaceList.length > 0;
      historyObj.skhubId = skhubId;
      await bsAddToHistory(stUserSession, historyObj);
    }
  };


  const onDownload = () => {
    try {
      let skylink = parseSkylink(dnldSkylink)
      launchSkyLink(skylink, stUserSetting);
    }
    catch (e) {
      setShowAlert(true);
      setAlertSeverity("error");
      setAlertMessage("Invalid skylink!");
    }
  };

  const testFunc = async () => {
    /* const id="yahoo_antares_va.id.blockstack";
    lookupProfile(id, "https://core.blockstack.org/v1/names")
    .then(profile=> console.log(profile)); */
    /*     let keyParams = {
      fileName: "key.json",
      options: { username: id, zoneFileLookupURL: "https://core.blockstack.org/v1/names", decrypt: false}
    }
    const key = await fetchData(stUserSession, keyParams); 
    console.log(key);*/
    const bucketId = "19gQ5gRSvUegvzoi9fVBDQMrFsm5sJgGzY";
    const skyspaceName = "Wallpaper";
    const key = await fetch(`https://gaia.blockstack.org/hub/${bucketId}/skhub/key/publicKey.json`)
      .then(res => res.json());
    const skyspaceDetail = await getSkySpace(stUserSession, skyspaceName);
    console.log(skyspaceDetail);
    const encryptedData = await encryptContent(stUserSession, JSON.stringify(skyspaceDetail), { publicKey: key });
    console.log("encryptedData", encryptedData);
    const putsharedfile = await bsPutSkyspaceInShared(stUserSession, encryptedData, skyspaceName, key);
  };

  const getTestFunc = () => {
    const senderStorageId = "168V9yPBBZ6y85qEonaTNNUqo323E7Pv9i";
    const skyspaceName = "Wallpaper";
    const skyspaceObj = bsGetSharedSkyspaceIdxFromSender(stUserSession, senderStorageId, skyspaceName);
  }

  const dirTestFunc = async () => {
    const skylink = "https://siasky.net/AABPKYOIaKdf7PiiEbmxl9etg_CSr6GPtlCmglAgiQsrKw";
    const dirBlob = await fetch(skylink).then(res => res.blob());
    console.log(new File([dirBlob], "folder.zip", { type: "application/zip", lastModified: new Date() }));
    /* const response = await (new SkynetClient(DEFAULT_PORTAL)).uploadDirectory(
      dir,
      encodeURIComponent(dir.name)
    );
    console.log(response); */
  }

  const getPublicAps = async () => {
    getPublicApps();
  }

  const importPublicAppsToSpaces = async (skyspaceList) => {
    setShowPublicToAccModal(false);
    dispatch(setLoaderDisplay(true));
    const publicObj = await getPublicApps(query.get(PUBLIC_TO_ACC_QUERY_PARAM));
    const promises = [];
    const skhubIdList = [];
    publicObj.map(app => {
      app.skhubId = null;
      promises.push(bsAddSkylinkOnly(stUserSession, app, stPerson).then((skhubid) => skhubIdList.push(skhubid)));
    });
    await Promise.all(promises);
    promises.length = 0;

    let historyObj = getEmptyHistoryObject();
    historyObj.fileName = "NA";
    historyObj.action = PUBLIC_IMPORT;
    historyObj.skyspaces = skyspaceList.join(", ");
    historyObj.savedToSkySpaces = skyspaceList && skyspaceList.length > 0;
    historyObj.skylink = query.get(PUBLIC_TO_ACC_QUERY_PARAM);
    promises.push(bsAddToHistory(stUserSession, historyObj));
    promises.push(bsAddSkhubListToSkylinkIdx(stUserSession, skhubIdList));
    promises.push(bsAddSkylinkFromSkyspaceList(stUserSession, skhubIdList, skyspaceList));
    await Promise.all(promises);

    dispatch(setLoaderDisplay(false));

    dispatch(fetchSkyspaceAppCount());
  }

  return (
    <div className="container-fluid register-container">
      <Grid container spacing={1} direction="row">
        {/* <button onClick={testFunc}>Test</button>
        <button onClick={getTestFunc}>Get Test</button> */}
        {/* <button onClick={getPublicAps}>Dir Test</button> */}
        <Grid item xs={12} sm={10} style={{ color: "red", paddingTop: 20 }}>
          Warning: Content uploaded using SkySpaces is not encrypted.
        </Grid>
        {stPerson && (<Grid item xs={12} sm={10} className="select-grid">
          <FormControl className={classes.formControl} error={errorObj.type}>
            {stSnSkyspaceList && (<Autocomplete
              multiple
              options={stSnSkyspaceList}
              getOptionLabel={(space) => space}
              name="skyspaceList"
              onChange={(evt, value) => setSkyspaceList(value)}
              renderInput={(params) => (
                <TextField {...params} label="Skyspace" margin="normal" />
              )}
            />)}
            <FormHelperText>
              {"Please select Space. This is a mandatory field."}
            </FormHelperText>
          </FormControl>
        </Grid>)}
        {stPerson && (<Grid item xs={12} sm={10} className="select-grid">
          <FormControl className={classes.formControl} error={errorObj.tags}>
            <ChipInput defaultValue={skyapp.tags} onChange={setTags}
            />
            <FormHelperText>Please select tags.</FormHelperText>
          </FormControl>
        </Grid>)}
        {!stPerson && (
          <>
            <Grid item xs={11} sm={9} className="dropzone-grid">
              <TextField
                id="dnldSkylink"
                name="dnldSkylink"
                label="Please enter Skylink to download"
                fullWidth
                autoComplete="off"
                onChange={evt => setDnldSkylink(evt.target.value)}
              />
            </Grid>
            <Grid item xs={1} sm={1} className="padding-t-20">
              <Tooltip title="Download Skylink Content" arrow>
                <CloudDownloadOutlinedIcon style={{ color: APP_BG_COLOR, fontSize: 35, cursor: 'pointer' }} onClick={onDownload} />
              </Tooltip>
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={10} className="dropzone-grid">
          <FormControl
            className="full-width"
            id="file-dropzone"
            error={errorObj.files}
          >
            <SnUpload
              name="files"
              ref={uploadEleRef}
              portal={getPortalFromUserSetting(stUserSetting)}
              fileList={skyapp.files}
              onUpload={onUpload}
            />
            <FormHelperText>Please select a file to upload.</FormHelperText>
          </FormControl>
        </Grid>
        {/* <button onClick={()=>uploadEleRef.current.click()}>Click</button> */}
      </Grid>

      <Snackbar
        open={showAlert}
        autoHideDuration={4000}
        onClose={() => setShowAlert(false)}
      >
        <Alert onClose={() => setShowAlert(false)} severity={alertSeverity || "success"}>
          {alertMessage}
        </Alert>
      </Snackbar>
      {/* <UploadProgress /> */}
      <SnAddToSkyspaceModal
        userSession={stUserSession}
        title={"Import into Skyspace"}
        open={showPublicToAccModal}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        availableSkyspaces={stSnSkyspaceList}
        showAddSkyspace={true}
        onClose={() => setShowPublicToAccModal(false)}
        onSave={importPublicAppsToSpaces}
      />
    </div>
  );
}
