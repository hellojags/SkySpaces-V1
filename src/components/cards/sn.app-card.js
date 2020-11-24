import React from "react";
import { getCompatibleTags, DOWNLOAD } from "../../sn.constants";
import useStyles from "./sn.app-card.styles";
import { CATEGORY_OBJ } from "../../sn.category-constants";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import Typography from "@material-ui/core/Typography";
import ImageIcon from "@material-ui/icons/Image";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Paper from "@material-ui/core/Paper";
import HeadsetIcon from "@material-ui/icons/Headset";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import Link from "@material-ui/core/Link";
import CardHeader from "@material-ui/core/CardHeader";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import cliTruncate from "cli-truncate";
import moment from "moment";
import {
  mapStateToProps,
  matchDispatcherToProps,
} from "./sn.app-card.container";
import CardContent from "@material-ui/core/CardContent";
import { green } from "@material-ui/core/colors";
import SnAppCardActionBtnGrp from "./sn.app-card-action-btn-grp";
import {
  bsGetSkyspaceNamesforSkhubId,
  bsAddSkylinkFromSkyspaceList,
  bsRemoveFromSkySpaceList,
  bsRemoveSkylinkFromSkyspaceList,
  bsAddToHistory,
} from "../../blockstack/blockstack-api";
import SnAddToSkyspaceModal from "../modals/sn.add-to-skyspace.modal";
import SnInfoModal from "../modals/sn.info.modal";
import { launchSkyLink, readableBytes } from "../../sn.util";
import Tooltip from "@material-ui/core/Tooltip";
import { APP_BG_COLOR } from "../../sn.constants";


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class SnAppCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      openCopySuccess: false,
      showAddToSkyspace: false,
      isSelected: false,
      availableSkyspaceToAddTo: [],
      snInfoModal: {
        open: false,
        onClose: () => {
          const snInfoModalState = this.state.snInfoModal;
          snInfoModalState.open = false;
          this.setState({
            snInfoModal: snInfoModalState,
          });
        },
        title: "Add To Spaces",
        description: "This Skylink is already present in all Spaces.",
      },
    };
    this.openSkyApp = this.openSkyApp.bind(this);
    this.trimDescription = this.trimDescription.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isSelect !== this.props.isSelect) {
      this.setState({ isSelected: false });
    }
  }

  trimDescription(strValue, maxLength) {
    if (strValue && strValue.length > maxLength) {
      return strValue.slice(0, maxLength - 3) + "...";
    } else {
      return strValue;
    }
  }

  openSkyApp(skapp) {
    this.props.onOpenSkyApp(skapp);
  }

  launchSkyLink = (skyLink) => {
    launchSkyLink(skyLink, this.props.snUserSetting);
  };

  removeFromSkyspace = async () => {
    const skhubId = this.props.app.skhubId;
    //this.props.setLoaderDisplay(true);
    //below condition means , this page is accessed from specific SkySpace
    if (typeof this.props.skyspace != "undefined" && this.props.skyspace) {
      // delete from specific skyspace JSON
      await bsRemoveFromSkySpaceList(
        this.props.userSession,
        this.props.skyspace,
        skhubId
      );
    } //this means , this page is accessed from search page. this.props.skyspace will not have any value in it. delete from all skyspaces.
    else {
      // Delete skhubId from all skyspace JSON
      await bsRemoveSkylinkFromSkyspaceList(
        this.props.userSession,
        skhubId,
        this.props.app.skyspaceList
      );
    }
    this.props.fetchSkyspaceAppCount();
    this.props.setLoaderDisplay(false);
    this.props.onDelete();
  };

  handleSkyspaceAdd = (app) => {
    const skhubId = app.skhubId;
    // get all SkySpaces associated with this skyhubId
    bsGetSkyspaceNamesforSkhubId(this.props.userSession, skhubId)
      .then((skyspacesForAppObj) => {
        let skyspacesForApp = [];
        if (
          skyspacesForAppObj != null &&
          skyspacesForAppObj.skyspaceForSkhubIdList != null
        ) {
          skyspacesForApp = skyspacesForAppObj.skyspaceForSkhubIdList;
        }
        return this.props.snSkyspaceList.filter(
          (skyspace) => skyspacesForApp.indexOf(skyspace) === -1
        );
      })
      .then((availableSkyspaces) => {
        if (availableSkyspaces != null && availableSkyspaces.length > 0) {
          this.setState({
            showAddToSkyspace: true,
            availableSkyspaces,
          });
        } else {
          const snInfoModalState = this.state.snInfoModal;
          snInfoModalState.open = true;
          this.setState({
            snInfoModal: snInfoModalState,
          });
        }
      });
  };

  saveAddToSkyspaceChanges = async (app, skyspaceList) => {
    if (skyspaceList != null && skyspaceList.lenghth !== 0) {
      this.props.setLoaderDisplay(true);
      await bsAddSkylinkFromSkyspaceList(
        this.props.userSession,
        app.skhubId,
        skyspaceList
      );
      this.props.setLoaderDisplay(false);
      this.setState({
        showAddToSkyspace: false,
      });
      this.props.fetchSkyspaceAppCount();
      this.props.fetchSkyspaceDetail();
    }
  };

  download = (app) => {
    this.props.setLoaderDisplay(true);
    bsAddToHistory(this.props.userSession, {
      skylink: app.skylink,
      fileName: app.name,
      action: DOWNLOAD,
      contentLength: "",
      contentType: "",
      skhubId: app.skhubId,
      skyspaces: [],
      savedToSkySpaces: false,
    }).then(() => {
      this.props.setLoaderDisplay(false);
      this.launchSkyLink(app.skylink);
    });
  };

  copyToClipboard = (evt) => {
    navigator.clipboard.writeText(this.props.app.skylink);
    this.setState({ openCopySuccess: true });
  };

  closeCopySucess = () => {
    this.setState({ openCopySuccess: false });
  };

  renderOtherSpaces = () => {
    if (this.props.allSpacesObj) {
      const otherSpaces = Object.keys(this.props.allSpacesObj)
        .filter(space => this.props.allSpacesObj.hasOwnProperty(space)
          && this.props.skyspace !== space
          && this.props.allSpacesObj[space]?.indexOf(this.props.app.skhubId) > -1);
      if (otherSpaces && otherSpaces.length > 0) {
        return (
          <div>
            <span className="pr-2 pl-2">
              <b>Other Spaces:</b>
            </span>
            {otherSpaces
              .map((space, idx) => (
                <Chip
                  key={idx}
                  label={space}
                  variant="outlined"
                  size="small"
                  style={{ backgroundColor: APP_BG_COLOR }}
                ></Chip>
              ))}
          </div>
        );
      } else {
        return "";
      }
    }
  }

  render() {
    const { app, classes } = this.props;


    return (
      <>
        <Grid item xs={12} style={{ marginTop: 10 }}>
          <Paper className={classes.paperStyling}>
            <Grid container spacing={3} style={{ width: "100%", margin: "auto" }}>
              <Grid item xs={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    {app.type != null &&
                      getCompatibleTags(app.type).map((category, idx) => {
                        return CATEGORY_OBJ[category] != null ? (
                          CATEGORY_OBJ[category].getLogo(classes.spaceIcons)
                        ) : (<></>)
                      })
                    }
                  </div>
                  <div style={{ paddingLeft: 20, cursor: "pointer" }}
                    onClick={() => {
                      this.download(app);
                    }}>
                    <Typography variant="span" className={classes.spaceName}>
                      {cliTruncate(app.name, 100, { position: "middle" })}
                    </Typography>
                  </div>
                  <div style={{ paddingLeft: 30 }}>
                    <Typography variant="span" className={classes.createAtTime}>
                      {app.contentType}
                    </Typography>
                  </div>
                  <div style={{ paddingLeft: 30 }}>
                    <Typography variant="span" className={classes.createAtTime}>
                      {readableBytes(app.contentLength)}
                    </Typography>
                  </div>
                  <div style={{ paddingLeft: 30 }}>
                    <Typography variant="span" className={classes.createAtTime}>
                      {moment(app.createTS).format(
                        "MM/DD/YYYY h:mm:ss a"
                      )}
                    </Typography>
                  </div>
                  {this.props.isSelect && (
                            <div style={{marginLeft: "auto"}}>
                              {this.props.arrSelectedAps.indexOf(app) === -1 && (
                                <RadioButtonUncheckedIcon className="selection-radio"
                                  onClick={() => this.props.onSelection(app)} />
                              )}
                              {this.props.arrSelectedAps.indexOf(app) > -1 && (
                                <RadioButtonCheckedIcon className="selection-radio"
                                  onClick={() => this.props.onSelection(app, true)} />
                              )}
                            </div>
                          )}
                </div>
                <div style={{ paddingLeft: 62 }} className={classes.createAtTime}>
                  {app.skylink} <Tooltip title="Copy Skylink to clipboard" arrow>
                    <FileCopyOutlinedIcon
                      onClick={this.copyToClipboard}
                      className="cursor-pointer"
                      style={{ color: APP_BG_COLOR, paddingLeft: 5 }}
                    />
                  </Tooltip>
                </div>
              </Grid>
              <Grid item xs={12} style={{ paddingTop: 0 }}>
                <div style={{ paddingLeft: 62 }}>
                  {this.trimDescription(app.description, 200)}
                  {this.renderOtherSpaces()}
                </div>
              </Grid>
              <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 0 }}>
                <SnAppCardActionBtnGrp
                  app={app}
                  hash={this.props.hash}
                  hideDelete={this.props.senderId != null}
                  hideAdd={this.props.senderId != null}
                  onAdd={() => this.handleSkyspaceAdd(app)}
                  onEdit={() => this.openSkyApp(app)}
                  onLaunch={() => this.launchSkyLink(app.skylink)}
                  onDelete={() => this.removeFromSkyspace()}
                  onDownload={() => this.download(app)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <SnAddToSkyspaceModal
          userSession={this.props.userSession}
          open={this.state.showAddToSkyspace}
          availableSkyspaces={this.state.availableSkyspaces}
          onClose={() => this.setState({ showAddToSkyspace: false })}
          onSave={(skyspaceList) =>
            this.saveAddToSkyspaceChanges(app, skyspaceList)
          }
        />
        <SnInfoModal
          open={this.state.snInfoModal.open}
          onClose={this.state.snInfoModal.onClose}
          title={this.state.snInfoModal.title}
          content={this.state.snInfoModal.description}
        />

        <Snackbar
          open={this.state.openCopySuccess}
          autoHideDuration={3000}
          onClose={this.closeCopySucess}
        >
          <Alert onClose={this.closeCopySucess} severity="success">
            Skylink successfully copied to clipboard!
          </Alert>
        </Snackbar>
      </>
    );

    return (
      <>
        <Grid item xs={12} className="side-padding-0">
          <Card className="card">
            <CardHeader
              className="no-padding-b"
              title={
                <div>
                  {app.type != null &&
                    getCompatibleTags(app.type).map((category, idx) => {
                      return CATEGORY_OBJ[category] != null ? (
                        <div key={idx}>
                          <span
                            style={{ color: APP_BG_COLOR }}
                            className="pr-2"
                          >
                            {CATEGORY_OBJ[category].getLogo()}
                          </span>
                          <Link
                            variant="inherit"
                            className="font-weight-bold cursor-pointer h5"
                            color="black"
                            onClick={() => {
                              this.download(app);
                            }}
                          >
                            {cliTruncate(app.name, 100, { position: "middle" })}
                          </Link>
                          <span className="display-5 skyspaceCardTime">
                            | Create Time:{" "}
                            {moment(app.createTS).format(
                              "MM/DD/YYYY h:mm:ss a"
                            )}
                          </span>
                          {this.props.isSelect && (
                            <>
                              {this.props.arrSelectedAps.indexOf(app) === -1 && (
                                <RadioButtonUncheckedIcon className="selection-radio"
                                  onClick={() => this.props.onSelection(app)} />
                              )}
                              {this.props.arrSelectedAps.indexOf(app) > -1 && (
                                <RadioButtonCheckedIcon className="selection-radio"
                                  onClick={() => this.props.onSelection(app, true)} />
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                          <Link
                            variant="inherit"
                            className="font-weight-bold cursor-pointer h5"
                            color="black"
                            onClick={() => {
                              this.download(app);
                            }}
                          >
                            {cliTruncate(app.name, 100, { position: "middle" })}
                          </Link>
                        );
                    })}
                </div>
              }
              subheader={
                <>
                  <span>{app.skylink}</span>
                  <Tooltip title="Copy Skylink to clipboard" arrow>
                    <FileCopyOutlinedIcon
                      onClick={this.copyToClipboard}
                      className="cursor-pointer"
                      style={{ color: APP_BG_COLOR, paddingLeft: 5 }}
                    />
                  </Tooltip>
                  <br />
                  Content-Type: <font color="primary">{app.contentType}</font> |
                  Content-Size:{" "}
                  <font color="primary">{readableBytes(app.contentLength)} </font>
                </>
              }
              subheaderTypographyProps={{ variant: "h9" }}
            />
            <CardContent className="no-padding-b">
              {this.trimDescription(app.description, 200)} <br />
              {this.renderOtherSpaces()}
            </CardContent>
            <div>
              <SnAppCardActionBtnGrp
                app={app}
                hash={this.props.hash}
                hideDelete={this.props.senderId != null}
                hideAdd={this.props.senderId != null}
                onAdd={() => this.handleSkyspaceAdd(app)}
                onEdit={() => this.openSkyApp(app)}
                onLaunch={() => this.launchSkyLink(app.skylink)}
                onDelete={() => this.removeFromSkyspace()}
                onDownload={() => this.download(app)}
              />
            </div>
          </Card>
        </Grid>
        <SnAddToSkyspaceModal
          userSession={this.props.userSession}
          open={this.state.showAddToSkyspace}
          availableSkyspaces={this.state.availableSkyspaces}
          onClose={() => this.setState({ showAddToSkyspace: false })}
          onSave={(skyspaceList) =>
            this.saveAddToSkyspaceChanges(app, skyspaceList)
          }
        />
        <SnInfoModal
          open={this.state.snInfoModal.open}
          onClose={this.state.snInfoModal.onClose}
          title={this.state.snInfoModal.title}
          content={this.state.snInfoModal.description}
        />

        <Snackbar
          open={this.state.openCopySuccess}
          autoHideDuration={3000}
          onClose={this.closeCopySucess}
        >
          <Alert onClose={this.closeCopySucess} severity="success">
            Skylink successfully copied to clipboard!
          </Alert>
        </Snackbar>
      </>
    );
  }
}

export default withStyles(useStyles)(
  connect(mapStateToProps, matchDispatcherToProps)(SnAppCard)
);
