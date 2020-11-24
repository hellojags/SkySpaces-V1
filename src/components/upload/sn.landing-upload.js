import React, { createRef, useEffect, useRef, useState } from "react";
import "./sn.landing-upload.css";
import { DropzoneArea } from "material-ui-dropzone";
import ImageIcon from "@material-ui/icons/Image";
import SnLandingUploadDisclaimer from "./sn.landing-upload-disclaimer";
import { parseSkylink } from "skynet-js";
import { getPortalFromUserSetting, launchSkyLink } from "../../sn.util";
import { useSelector } from "react-redux";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import SnUpload from "../new/sn.upload";
import { useHistory } from "react-router-dom";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function SnLandingUpload(props) {
    const [thumbnail, setThumb] = useState("");
    const [userSkylink, setUserSkylink] = useState("");
    const [invalidSkylink, setInvalidSkylink] = useState(false);
    const [isDirUpload, setIsDirUpload] = useState(false);

    const uploadEleRef = useRef();
    const history = useHistory();

    const stUserSession = useSelector((state) => state.userSession);
    const stPerson = useSelector((state) => state.person);

    useEffect(() => {
        stPerson!=null && history.push("/upload")
    }, [])
    const handleImage = (files) => {
        if (files.length) {
            setThumb(files[0]);
        }
    };
    const delImg = () => {
        setThumb("");
    };
    const download = () => {
        try {
            let skylink = parseSkylink(userSkylink)
            launchSkyLink(skylink, stUserSession);
        }
        catch (e) {
            console.log("parsing error");
            setInvalidSkylink(true);
        }
    };
    return (
        <div style={{ paddingTop: 80 }}>
            <SnLandingUploadDisclaimer />
            <div className="container-fluid main-upload-component">
                <div className="container most-main-div">
                    <div className="main-cntner">
                        <div className="row main-rw-row-div">
                            {/* column 1 */}

                            <div className="col col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 firstColumn">
                                {/* col 1 title */}
                                <div className="colum1-title-div">Upload Your {isDirUpload ? "Directory" : "Files"}</div>
                                {/* drag n drop col 1 */}
                                <div className="col1-dnd-div">
                                    {/* dropzone */}

                                    <div className="d-none">
                                        <SnUpload
                                        name="files"
                                        ref={uploadEleRef}
                                        directoryMode={isDirUpload}
                                        onUpload={console.log}
                                        />
                                    </div>

                                    <DropzoneArea
                                        filesLimit={100}
                                        onDrop={(files)=>uploadEleRef.current.handleDrop(files)}
                                        className="dropZonArea_drop_image"
                                        Icon={"none"}
                                        maxFileSize={210000000}
                                        onDelete={delImg}
                                        dropzoneText={
                                            <div>
                                                <span
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: "bold",
                                                        color: "gray",
                                                    }}
                                                >
                                                    Drop Your {isDirUpload ? "Directory" : "Files"} here
                      </span>
                                            </div>
                                        }
                                    />
                                </div>
                                <div className="butn-upld-col1-toggle-div">
                                    <button className="btn  btn butn-upld-col1"
                                        onClick={(evt)=>uploadEleRef.current.gridRef.current.click(evt)}>
                                        {/*  onClick={(evt)=>console.log(uploadEleRef)}> */}
                                        <i className="fa fa-download upld-col1-icon-downld">
                                            &nbsp;&nbsp;&nbsp;Upload
                  </i>
                                    </button>
                                    <div className="toggle-switch-col1-btn">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                onChange={(evt)=>setIsDirUpload(evt.target.checked)}
                                                id="customSwitches"
                                            />
                                            <label
                                                className="custom-control-label"
                                                for="customSwitches"
                                            ></label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* column 2 */}

                            <div className="col col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 secondColumn">
                                {/* col2 title */}
                                <div className="colum2-title-div">Paste Skylink</div>
                                {/* col2 description */}
                                <div className="colum2-desc-div">
                                    Paste Your Skylink to hunt your data
              </div>
                                {/* col2 input with icon */}
                                <div className="colum2-inpt-div">
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            onChange={(evt) => setUserSkylink(evt.target.value)}
                                            className="form-control colum2-input-with-icon"
                                            aria-label="Amount (to the nearest dollar)"
                                            placeholder="Please Enter Skylink to download"
                                        />
                                        <div className="input-group-append cursor-pointer" onClick={download}>
                                            <span className="input-group-text icon-inpt-colum2">
                                                {/* icon  */}
                                                <div className="srch_btn_main_div_changed">
                                                    <i className="fa fa-download colum2-icon-dwnload"></i>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12 thirdColumn">
                        Upon uploading a file , Skynet a 46 byte link called a skylink.
          <br />
          this link can then be shared with anyone to retrieve the file on any
          skynet Webportal.
        </div>
                </div>
            </div>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={invalidSkylink}
                autoHideDuration={3000}
                onClose={() => setInvalidSkylink(false)}
                TransitionComponent={"Fade"}
            >
                <Alert onClose={() => setInvalidSkylink(false)} severity="error">
                    Invalid Skylink ! Please enter valid 46 character skylink to Download.
      </Alert>
            </Snackbar>

        </div>
    );
}
export default SnLandingUpload;
