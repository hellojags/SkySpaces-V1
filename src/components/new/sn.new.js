import React from "react";
import Grid from "@material-ui/core/Grid";
import { InputLabel, FormControl } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { SkynetClient } from "skynet-js";
import imageCompression from "browser-image-compression";
import FormHelperText from "@material-ui/core/FormHelperText";
import { withStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import ChipInput from "material-ui-chip-input";
import classNames from "classnames/bind";
import { uploadToSkynet } from "../../skynet/sn.api.skynet"
import { ValidatorForm } from "react-material-ui-form-validator";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { mapStateToProps, matchDispatcherToProps } from "./sn.new.container";
import SnNewButton from "./sn.new.button";
import SnInfoModal from "../modals/sn.info.modal";
import SnCarousalMenu from "../tools/sn.carousal-menu";
import { ID_PROVIDER } from "../../blockstack/constants";
import { map } from "rxjs/operators";
import { getSkylinkHeader } from "../../skynet/sn.api.skynet";
import { parseSkylink } from "skynet-js";
import { getEmptyHistoryObject } from "../new/sn.new.constants";
import SnAddSkyspaceModal from "../modals/sn.add-skyspace.modal";
import { APP_BG_COLOR, ADD_SKYSPACE } from "../../sn.constants";
import {
  createEmptyErrObj,
  SKYLINK_TYPE_SKYLINK,
} from "./sn.new.constants";
import { DELETE, UPLOAD } from "../../sn.constants";
import { getCategoryObjWithoutAllAsArray, getCategoryObjWithoutAll } from "../../sn.category-constants";
import { getPortalFromUserSetting, getCompressedImageFile, generateThumbnailFromVideo, videoToImg } from "../../sn.util";
import {
  bsAddSkylink,
  bsAddSkylinkFromSkyspaceList,
  bsRemoveSkylinkFromSkyspaceList,
  bsDeleteSkylink,
  bsRemoveFromSkySpaceList,
  bsAddToHistory,
  getSkyLinkIndex,
} from "../../blockstack/blockstack-api";
import { generateSkyhubId } from "../../blockstack/utils";

const useStyles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

let appId = "";

class SnNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      openSecretIdDlg: false,
      redirectToAllApps: false,
      edit: false,
      isRegister: false,
      openEnableEditDlg: false,
      isAppOwner: false,
      snInfoModal: {
        open: false,
        title: "",
        description: "",
        onClose: () => {},
      },
      showAddSkyspace: false,
      skyspaceModal: {
        title: "Add New Skyspace",
        skyspaceName: null,
        type: ADD_SKYSPACE,
      },
      errorObj: createEmptyErrObj(),
    };
    this.handleDoneBtn = this.handleDoneBtn.bind(this);
    this.handleEditBtn = this.handleEditBtn.bind(this);
  }
  handleAddSpaceOpen = () => {
    this.setState({
      showAddSkyspace: true,
    });
  };

  handleAddSpaceClose = () => {
    this.setState({
      showAddSkyspace: false,
      skyspaceModal: {
        title: "",
        skyspaceName: "",
        type: "",
      },
    });
  };
  addSkyspace = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    console.log("add skypace clicked");
    this.setState({
      skyspaceModal: {
        title: "Add New Skyspace",
        skyspaceName: "",
        type: ADD_SKYSPACE,
      },
    });
    this.handleAddSpaceOpen();
  };
  handleInfoModalClose = () => {
    const snInfoModal = {
      open: false,
      title: "",
      description: "",
      onClose: () => {},
    };
    this.setState({
      snInfoModal,
      redirectToAllApps: true,
    });
  };

  handleEditBtn() {
    this.setState({
      openEnableEditDlg: true,
    });
  }

  handleDoneBtn() {
    this.setState({
      redirectToAllApps: true,
    });
  }

  componentDidMount() {
    const path = this.props.match.path;
    if (path === "/register") {
      this.setState({
        isRegister: true,
        isAppOwner: true,
      });
      this.props.setAppSkyspces({
        skyspaceForSkhubIdList: [],
        isAppOwner: true,
      });
    } else {
      const id = decodeURIComponent(this.props.match.params.id);
      appId = id;
      this.setState({
        isRegister: false,
      });
      this.getSkyAppDetails(id);
    }
  }

  componentWillUnmount() {
    this.props.fetchEmptyApp();
    // this.props.setAppSkyspces([]);
  }

  getSkyAppDetails(skyAppId) {
    getSkyLinkIndex(this.props.userSession)
      .then((skylinkIndex) => {
        if (
          skylinkIndex != null &&
          skylinkIndex.skhubIdList.includes(skyAppId)
        ) {
          this.setState({
            isAppOwner: true,
          });
        }
        return;
      })
      .then(() => {
        const locationSearchStr = this.props.location.search;
        console.log(
          "tester",
          this.props.snAppSkyspaces != null &&
            this.props.snAppSkyspaces.isAppOwner
        );
        this.props.fetchSkyspaceAppDetail({
          skyAppId,
          session: this.props.userSession,
        });
        /* if (locationSearchStr.indexOf("category") > -1) {
          this.props.fetchAppDetail({
            skyAppId,
            session: this.props.userSession,
          });
        } else if (locationSearchStr.indexOf("skyspace") > -1 || locationSearchStr.indexOf("history") > -1) {
          this.props.fetchSkyspaceAppDetail({
            skyAppId,
            session: this.props.userSession,
          });
        } */
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const path = this.props.match.path;
    if (path === "/register") {
      if (!this.state.isRegister) {
        this.setState({
          isRegister: true,
          isAppOwner: true,
        });
        this.props.setAppSkyspces({
          skyspaceForSkhubIdList: [],
          isAppOwner: true,
        });
        this.props.fetchEmptyApp();
        this.props.setAppSkyspces([]);
      }
      return;
    }
    const { id } = this.props.match.params;
    appId = id;
    if (this.state.isRegister) {
      this.setState({
        isRegister: false,
      });
    }
  }

  handleSecretIdDlgClose = () => {
    this.setState({
      openSecretIdDlg: false,
      redirectToAllApps: true,
    });
  };

  handleSkylinkCreationSuccess = (param) => {
    this.props.setLoaderDisplay(false);
    this.props.fetchSkyspaceAppCount();
    let action = "updated";
    if (this.state.isRegister) {
      action = "saved";
    } else if (param === DELETE) {
      action = "deleted";
    }
    const snInfoModal = {
      open: true,
      title: "Status : Success",
      description: "Skylink has been " + action + " Successfully.",
      onClose: this.handleInfoModalClose,
    };
    this.setState({ snInfoModal });
  };

  categorySpecificTask = async (app)=> {
    const apiUrl = getPortalFromUserSetting(this.props.snUserSetting);
    const skylinkUrl = apiUrl + parseSkylink(app.skylink);
    const skylinkRes = await fetch(skylinkUrl);
    const skylinkFileBlob = await skylinkRes.blob();
    app.contentType = skylinkRes.headers.get("content-type");
    app.contentLength = skylinkRes.headers.get("content-length");
    const client = new SkynetClient(apiUrl);
    let res;
    switch(app.type){
      case "pictures": 
        const dataUrl = await imageCompression.getDataUrlFromFile(skylinkFileBlob);
        const file = await imageCompression.getFilefromDataUrl(dataUrl, "image");
        const compressedImgFile = await getCompressedImageFile(file)
        res = await uploadToSkynet(compressedImgFile, client);
        app.thumbnail = res != null ? res.skylink : "";
        break;
      case "video":
        const video = document.querySelector(`#hidden-upload-video`);
        let videoResolve = null;
        const videoPromise = new Promise((resolve) => videoResolve = resolve);
        video.src=skylinkUrl;
        video.onloadeddata = videoResolve;
        video.load();
        await videoPromise;
        const thumbnailImgFile = await videoToImg(video);
        res = await uploadToSkynet(thumbnailImgFile, client);
        app.thumbnail = res != null ? res.skylink : "";
        break;
      default:
        console.log("default");
    }
  }

  // This is main method to handle submits
  handleSubmit = async (evt, param) => {
    evt.preventDefault();
    let isError = false;
    for (const key in this.props.skyapp) {
      if (this.props.skyapp.hasOwnProperty(key)) {
        isError = isError || this.onSubmitValidateField(key);
      }
      if (isError) {
        break;
      }
    }
    if (isError) {
      return;
    }
   this.props.setLoaderDisplay(true);
    //If param is NULL its "Save Skylink" operation
    if (param == null) {
      await this.categorySpecificTask(this.props.skyapp);
      let skhubId = "";
      //Add Skylink to BlockStack
      bsAddSkylink(this.props.userSession, this.props.skyapp, this.props.person)
        .then((id) => {
          //skhubId = id;
          if (this.props.skyapp.skhubId) {
            skhubId = this.props.skyapp.skhubId;
          } else {
            skhubId = id;
          }
          // check if any SkySpaces are associated with this skylink
          if (this.props.skyapp.skyspaceList != null) {
            const skyspaceCnt = this.props.skyapp.skyspaceList.length;
            if (skyspaceCnt > 0) {
              // Add SkhubId to List of SkySpaces
              return bsAddSkylinkFromSkyspaceList(
                this.props.userSession,
                skhubId,
                this.props.skyapp.skyspaceList
              );
            }
          } else if (this.props.skyapp.skyspaceList == null) {
            // no skyspace associated with this skylink
            this.props.skyapp.skyspaceList = [];
          }

          // check if any SkySpaces are de-selected(removed) for this skylink.
          if (
            this.props.snAppSkyspaces != null &&
            this.props.snAppSkyspaces.skyspaceForSkhubIdList &&
            this.props.snAppSkyspaces.skyspaceForSkhubIdListlength > 0
          ) {
            const skyspacesToRemoveFrom = this.props.snAppSkyspaces.skyspaceForSkhubIdList.filter(
              (x) => {
                const includedInSkylinkskyspce = this.props.skyapp.skyspaceList.includes(
                  x
                );
                return !includedInSkylinkskyspce;
              }
            );
            if (
              skyspacesToRemoveFrom != null &&
              skyspacesToRemoveFrom.length > 0
            ) {
              return bsRemoveSkylinkFromSkyspaceList(
                this.props.userSession,
                skhubId,
                skyspacesToRemoveFrom
              );
            }
          }
          return "";
        })
        .then(() => {
          //Add skyspace in history. also add Header information if not already present.
          let historyObj = getEmptyHistoryObject();
          //this.props.skyapp.skhubId = generateSkyhubId(ID_PROVIDER + ":" + this.props.person.profile.decentralizedID + ":" + uploadObj.skylink);
          historyObj.skhubId = this.props.skyapp.skhubId;
          historyObj.skylink = this.props.skyapp.skylink;
          historyObj.fileName = this.props.skyapp.name;
          historyObj.action = UPLOAD;
          historyObj.skyspaces = this.props.skyapp.skyspaceList;
          historyObj.savedToSkySpaces =
            this.props.skyapp.skyspaceList &&
            this.props.skyapp.skyspaceList.length > 0
              ? true
              : false;
          if (
            this.props.skyapp.contentLength &&
            this.props.skyapp.contentType
          ) {
            historyObj.contentLength = this.props.skyapp.contentLength;
            historyObj.contentType = this.props.skyapp.contentType;
            bsAddToHistory(this.props.userSession, historyObj);
          } //if Skylink header infromation is missing, go and fetch it.
          else {
            //Get Skylink Header Params
            let apiUrl =
              getPortalFromUserSetting(this.props.snUserSetting) +
              this.props.skyapp.skylink;
            getSkylinkHeader(apiUrl)
              .pipe(
                map((res) => {
                  historyObj.contentLength = res.contentLength;
                  historyObj.contentType = res.contentType;
                  this.handleChange(res.contentLength, {
                    key: "contentLength",
                  });
                  this.handleChange(res.contentType, {
                    key: "contentType",
                  });
                  return historyObj;
                })
              )
              .subscribe(
                (result) => {
                  //update skylink with Header data. There is better / efficient way to avoid second call. This method requires rework.
                  bsAddSkylink(
                    this.props.userSession,
                    this.props.skyapp,
                    this.props.person
                  ).then(() => {
                    bsAddToHistory(this.props.userSession, historyObj).then(
                      () => {
                        return result;
                      }
                    );
                  });
                },
                (err) => {
                  return err;
                }
              );
          }
        })
        .then(() => {
          this.handleSkylinkCreationSuccess();
        })
        .catch((err) => {
          this.props.setLoaderDisplay(false);
        });
    } else if (param === DELETE) {
      //TODO: I think here we should first remove from all skyspaces and then remove skylink. Order needs to be reversed
      bsDeleteSkylink(this.props.userSession, this.props.skyapp.skhubId).then(
        () => {
          //If skylink is associated with SkySpaces, remove skylink reference from skyspaces as well.
          if (this.props.skyapp.skyspaceList != null) {
            const skyspaceCnt = this.props.skyapp.skyspaceList.length;
            let returnCnt = 0;
            this.props.skyapp.skyspaceList.forEach((skyspace, idx) => {
              bsRemoveFromSkySpaceList(
                this.props.userSession,
                skyspace,
                this.props.skyapp.skhubId
              ).then((res) => {
                if (++returnCnt === skyspaceCnt) {
                  this.handleSkylinkCreationSuccess(DELETE);
                }
              });
            });
          } else {
            this.handleSkylinkCreationSuccess(DELETE);
          }
        }
      );
    }
    return;
  };

  onSubmitValidateField(fieldName) {
    let { errorObj } = this.state;
    const fieldVal = this.props.skyapp[fieldName];
    let isError = false;
    if (
      this.props.snAppSkyspaces != null &&
      this.props.snAppSkyspaces.isAppOwner === true
    ) {
      switch (fieldName) {
        case "skylink":
          try {
            parseSkylink(fieldVal);
          } catch (e) {
            errorObj[fieldName] = true;
            errorObj[fieldName + ".errorMsg"] = e;
            isError = true;
          }
          break;
        case "skyspaceList":
          try {
            if (fieldVal && fieldVal.length > 0) {
            } else {
              errorObj[fieldName] = true;
              errorObj[fieldName + ".errorMsg"] =
                "please select atleast one Space for this Skylink. Its mandatory field.";
              isError = true;
            }
          } catch (e) {
            errorObj[fieldName] = true;
            errorObj[fieldName + ".errorMsg"] = e;
            isError = true;
          }
          break;
        case "name":
        // case "description":
        case "type":
          errorObj[fieldName] = fieldVal == null || fieldVal.trim() === "";
          isError = errorObj[fieldName];
          break;
        default:
      }
    }
    this.setState({ errorObj });
    return isError;
  }

  validateField(fieldName) {
    let { errorObj } = this.state;
    const fieldVal = this.props.skyapp[fieldName];
    let isError = false;
    if (
      this.props.snAppSkyspaces != null &&
      this.props.snAppSkyspaces.isAppOwner === true
    ) {
      switch (fieldName) {
        case "name":
        // case "description":
        case "skylink":
        case "type":
          errorObj[fieldName] = fieldVal == null || fieldVal.trim() === "";
          isError = errorObj[fieldName];
          break;
        default:
      }
    }
    this.setState({ errorObj });
    return isError;
  }

  handleChange = (evt, options) => {
    const { skyapp } = this.props;
    if (
      this.props.snAppSkyspaces != null &&
      (this.props.snAppSkyspaces.isAppOwner == null ||
        this.props.snAppSkyspaces.isAppOwner === false)
    ) {
      return;
    }
    let fieldName = "";
    if (options != null) {
      fieldName = options.key;
      if (options.isArray != null && options.isArray === true) {
        if (options.pop === true) {
          skyapp[fieldName].remove(evt);
        } else {
          skyapp[fieldName].push(evt);
        }
      } else if (options.isCallback === true) {
        skyapp[fieldName] = options.callback(skyapp[fieldName], evt);
      } else {
        skyapp[fieldName] = evt;
      }
    } else {
      const eleType = evt.target.type;
      fieldName = evt.target.name;
      if (eleType === "checkbox") {
        skyapp[fieldName] = evt.target.checked;
      } else {
        skyapp[fieldName] = evt.target.value;
      }
    }
    this.validateField(fieldName);
  };

  setTypeFromFile = (fileType)=>{
    const categoryObj = getCategoryObjWithoutAll();
    const category = Object.keys(categoryObj).find(category=>categoryObj[category].fileTypeList && categoryObj[category].fileTypeList.indexOf(fileType)>-1);
    category && this.handleChange(category, {
      key: "type",
    });
  }

  onUpload = (uploadObj) => {
    this.props.setLoaderDisplay(true);
    this.handleChange(uploadObj.skylink, {
      key: "skylink",
    });
    this.handleChange(uploadObj.name, {
      key: "name",
    });
    this.handleChange(uploadObj.thumbnail, {
      key: "thumbnail",
    });
    this.setTypeFromFile(uploadObj.fileType);
    //Note we dont have skysapces yet so its empty. SkySpaces will be added to history on "Save Skylink".
    let historyObj = getEmptyHistoryObject();
    historyObj.skylink = uploadObj.skylink;
    historyObj.fileName = uploadObj.title;
    historyObj.action = UPLOAD;
    historyObj.savedToSkySpaces = false;
    this.props.skyapp.skhubId = generateSkyhubId(
      ID_PROVIDER +
        ":" +
        this.props.person.profile.decentralizedID +
        ":" +
        uploadObj.skylink
    );
    historyObj.skhubId = this.props.skyapp.skhubId;
    //Get Skylink Header Params
    let apiUrl =
      getPortalFromUserSetting(this.props.snUserSetting) + uploadObj.skylink;
    getSkylinkHeader(apiUrl)
      .pipe(
        map((res) => {
          historyObj["contentLength"] = res["contentLength"];
          historyObj["contentType"] = res["contentType"];
          bsAddToHistory(this.props.userSession, historyObj).then(() => {
            this.handleChange(res.contentLength, {
              key: "contentLength",
            });
            this.handleChange(res.contentType, {
              key: "contentType",
            });
            //this.props.setLoaderDisplay(false);
          });
          return historyObj;
        })
      )
      .subscribe(
        (result) => {
          console.log("getSkylinkHeader : contentLength : "+result["contentLength"])
          this.props.setLoaderDisplay(false);
          return result;
        },
        (err) => {
          this.props.setLoaderDisplay(false);
          return err;
        }
      );
  };

  getSkyspaceListForCarousalMenu = () => {
    if (this.props.snSkyspaceList != null) {
      const carousalMenuObj = {};
      this.props.snSkyspaceList.forEach((skyspace) => {
        carousalMenuObj[skyspace] = {
          label: skyspace,
        };
      });
      return carousalMenuObj;
    }
  };

  setTypeAutoCompleteValue = () => {
    const selectedObj = getCategoryObjWithoutAllAsArray().filter(
      (obj) => obj.key === this.props.skyapp.type
    );
    return selectedObj != null && selectedObj.length > 0
      ? selectedObj[0]
      : null;
  };

  render() {
    const { classes } = this.props;
    const {
      showLoader,
      redirectToAllApps,
      isRegister,
      edit,
      errorObj,
    } = this.state;
    const { skyapp } = this.props;
    const isAppOwner =
      this.props.snAppSkyspaces != null && this.props.snAppSkyspaces.isAppOwner;

    if (redirectToAllApps) {
      return <Redirect to="/history" />;
    }

    if (!showLoader) {
      return (
        <div className="container-fluid register-container">
          <ValidatorForm
            ref="form"
            onSubmit={this.handleSubmit}
            onError={(errors) => console.log(errors)}
          >
            <Grid container spacing={1}>
            <video
                    src=""
                    muted
                    controls
                    crossOrigin="anonymous"
                    loop
                    className="d-none"
                    id="hidden-upload-video"
                  ></video>

              <Grid item xs={12} sm={10}>
                <TextField
                  id="skylink"
                  name="skylink"
                  label="Skylink URL"
                  error={errorObj.skylink}
                  fullWidth
                  value={skyapp.skylink}
                  autoComplete="off"
                  helperText={
                    "Please provide 46 character skylink." +
                    (errorObj.skylink && errorObj["skylink.errorMsg"] !== ""
                      ? "Details:" + errorObj["skylink.errorMsg"]
                      : "")
                  }
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 200);
                  }}
                  onChange={this.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={10}>
                <TextField
                  id="name"
                  name="name"
                  label={
                    "File Name" +
                    (skyapp.bookmark || skyapp.permission ? "*" : "")
                  }
                  fullWidth
                  error={errorObj.name}
                  value={skyapp.name}
                  autoComplete="off"
                  onChange={this.handleChange}
                  helperText={
                    errorObj.name
                      ? "File name is a mandatory field."
                      : "Max 200 characters. " +
                        (skyapp.bookmark || skyapp.permission
                          ? "This is a mandatory field."
                          : "")
                  }
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 200);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={10}>
                <FormControl
                  className="full-width"
                  error={errorObj.description}
                >
                  <TextareaAutosize
                    rowsMin={4}
                    aria-label="maximum height"
                    name="description"
                    label="Description*"
                    placeholder="Description"
                    value={skyapp.description}
                    autoComplete="off"
                    onInput={(e) => {
                      e.target.value = e.target.value.slice(0, 500);
                    }}
                    onChange={this.handleChange}
                  />
                  <FormHelperText>
                    {"Max 500 characters. " +
                      (errorObj.name ? "This is a mandatory field." : "")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={10} className="select-grid">
                <FormControl
                  className={classes.formControl}
                  error={errorObj.skyspaceList}
                >
                  <InputLabel className="carousal-label">
                    {"SkySpace" +
                      (skyapp.bookmark || skyapp.permission ? "*" : "")}
                  </InputLabel>
                  <div className="skapp-skyspace-ctrl">
                    {this.props.snSkyspaceList != null &&
                    this.props.snSkyspaceList.length > 0 ? (
                      <SnCarousalMenu
                        selectedItems={
                          this.props.snAppSkyspacesToChange != null &&
                          this.props.snAppSkyspacesToChange
                            .skyspaceForSkhubIdList != null
                            ? this.props.snAppSkyspacesToChange
                                .skyspaceForSkhubIdList
                            : []
                        }
                        itemsObj={this.getSkyspaceListForCarousalMenu()}
                        labelKey={"label"}
                        onUpdate={(evt) =>
                          this.handleChange(evt, { key: "skyspaceList" })
                        }
                      />
                    ) : (
                      <Grid item xs={12} sm={10} justify="flex-start">
                        <Tooltip title="Create New Space" arrow>
                          <IconButton
                            onClick={this.addSkyspace}
                            justify="flex-start"
                          >
                            <AddCircleOutlineOutlinedIcon
                              style={{ color: APP_BG_COLOR, fontSize: 25 }}
                            />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    )}
                  </div>
                  <FormHelperText>
                    {"Please select atleast one Space (mandatory field)" +
                      (skyapp.permission ? "This is a mandatory field." : "")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {
                <Grid item xs={12} sm={10} className="select-grid">
                  <FormControl
                    className={classes.formControl}
                    error={errorObj.tags}
                  >
                    {/* <InputLabel id="demo-simple-select-label">
                      {"Tag" + (skyapp.permission ? "*" : "")}
                    </InputLabel> */}
                    {/* <SnCarousalMenu
                      selectedItems={skyapp.tags}
                      itemsObj={getCategoryObjWithoutAll()}
                      labelKey={"heading"}
                      onUpdate={(evt) =>
                        this.handleChange(evt, { key: "tags" })
                      }
                    /> */}
                    <ChipInput
                      value={skyapp.tags}
                      onAdd={(chip) =>
                        this.handleChange(chip, { key: "tags", isArray: true })
                      }
                      onDelete={(chip, index) => {
                        this.handleChange(chip, {
                          key: "tags",
                          isCallback: true,
                          callback: (currVal, index) => {
                            currVal.splice(index, 1);
                            return currVal;
                          },
                        });
                      }}
                    />
                    <FormHelperText>
                      {"Please select tags. " +
                        (skyapp.permission ? "This is a mandatory field." : "")}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              }
              <Grid item xs={12} sm={10} className="select-grid">
                <FormControl
                  className={classes.formControl}
                  error={errorObj.type}
                >
                  <Autocomplete
                    options={getCategoryObjWithoutAllAsArray()}
                    getOptionLabel={(option) => option.label}
                    value={this.setTypeAutoCompleteValue()}
                    name="type"
                    onChange={(evt, value) => {
                      this.handleChange(value == null ? null : value.key, {
                        key: "type",
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Category" margin="normal" />
                    )}
                  />
                  <FormHelperText>
                    {"Please select category. This is a mandatory field."}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {skyapp.category === SKYLINK_TYPE_SKYLINK && (
                <>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      id="git_url"
                      name="git_url"
                      label="Github/GitLab URL"
                      fullWidth
                      value={skyapp.git_url}
                      autoComplete="off"
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      id="demo_url"
                      name="demo_url"
                      label="Demo URL"
                      fullWidth
                      value={skyapp.demo_url}
                      autoComplete="off"
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      id="developer"
                      name="developer"
                      label="Developed By"
                      fullWidth
                      value={skyapp.developer}
                      autoComplete="off"
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      id="appStatus"
                      name="appStatus"
                      label="App Status"
                      fullWidth
                      value={skyapp.appStatus}
                      autoComplete="off"
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      id="support"
                      name="support"
                      label="Support"
                      fullWidth
                      value={skyapp.support}
                      autoComplete="off"
                      onChange={this.handleChange}
                    />
                  </Grid>
                </>
              )}
              <Grid
                item
                xs={12}
                sm={10}
                className={classNames({
                  "button-grid": true,
                })}
              >
                <SnNewButton
                  isRegister={isRegister}
                  isAppOwner={
                    this.props.snAppSkyspaces != null &&
                    this.props.snAppSkyspaces.isAppOwner
                  }
                  edit={edit}
                  onDelete={this.handleSubmit}
                  onEdit={this.handleEditBtn}
                  onDone={this.handleDoneBtn}
                />
              </Grid>
            </Grid>
          </ValidatorForm>
          <SnInfoModal
            open={this.state.snInfoModal.open}
            onClose={this.state.snInfoModal.onClose}
            title={this.state.snInfoModal.title}
            content={this.state.snInfoModal.description}
          />
          <SnAddSkyspaceModal
            open={this.state.showAddSkyspace}
            title={this.state.skyspaceModal.title}
            skyspaceName={this.state.skyspaceModal.skyspaceName}
            handleClickOpen={this.handleAddSpaceOpen}
            handleClose={this.handleAddSpaceClose}
            type={this.state.skyspaceModal.type}
          />
        </div>
      );
    } else {
      return <div className="loader"></div>;
    }
  }
}

export default withStyles(useStyles)(
  connect(mapStateToProps, matchDispatcherToProps)(SnNew)
);
