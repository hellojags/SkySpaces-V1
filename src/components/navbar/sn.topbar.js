import React from "react";
import skyapplogo from "../../SkySpaces_g.png";
import FormControl from '@material-ui/core/FormControl';
import skyapplogo_only from "../../SkySpaces_logo_transparent_small.png";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import InputLabel from '@material-ui/core/InputLabel';
import MuiAlert from "@material-ui/lab/Alert";
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import Tooltip from "@material-ui/core/Tooltip";
import AppBar from "@material-ui/core/AppBar";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import AppsOutlinedIcon from "@material-ui/icons/AppsOutlined";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import Search from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import { APP_BG_COLOR, DEFAULT_PORTAL, PUBLIC_SHARE_APP_HASH, PUBLIC_SHARE_ROUTE } from "../../sn.constants";
import { NavLink } from "react-router-dom";
import { SKYNETHUB_PORTAL } from "../../sn.constants";
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined";
import { getAllPublicApps, launchSkyLink, subtractSkapps } from "../../sn.util";
import { parseSkylink, SkynetClient } from "skynet-js";
import {
  getSkylinkIdxObject,
  getSkylink,
} from "../../blockstack/blockstack-api";
import SnSignin from "./sn.signin";
import { connect } from "react-redux";
import { mapStateToProps, matchDispatcherToProps } from "./sn.topbar.container";
import { getPublicApps, getSkylinkPublicShareFile } from "../../skynet/sn.api.skynet";
import SnInfoModal from "../modals/sn.info.modal";

const drawerWidth = 240;
const useStyles = (theme) => ({
  root: {
    display: "flex",
  },
  portalFormControl: {
    marginBottom: 10
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
class SnTopBar extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchStr: "",
      invalidSkylink: false,
      publicPortal: DEFAULT_PORTAL,
      showInfoModal: false,
      infoModalContent: "",
      onInfoModalClose: () => this.setState({ showInfoModal: false })
    };
  }

  getSkylinkIdxObject = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    getSkylinkIdxObject(this.props.userSession).then((skyLinkIdxObject) => {
      getSkylink(this.props.userSession, skyLinkIdxObject.skhubIdList[1]);
    });
  };

  triggerSearch = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.props.snPublicHash != null) {
      if (this.state.searchStr == null || this.state.searchStr.trim() === "") {
        const allPublicApps = await getPublicApps(this.props.snPublicHash);
        this.props.setApps(getAllPublicApps(allPublicApps.data, this.props.snPublicInMemory.addedSkapps, this.props.snPublicInMemory.deletedSkapps));

      } else {
        this.props.setLoaderDisplay(true);
        const allPublicApps = await getPublicApps(this.props.snPublicHash);
        const filteredApps = getAllPublicApps(allPublicApps.data, this.props.snPublicInMemory.addedSkapps, this.props.snPublicInMemory.deletedSkapps)
          .filter((app) => {
            if (this.state.searchStr && this.state.searchStr.trim() !== "") {
              for (const skyAppKey in app) {
                if (
                  app.hasOwnProperty(skyAppKey) &&
                  skyAppKey !== "category" &&
                  app[skyAppKey] != null &&
                  app[skyAppKey]
                    .toString()
                    .toLowerCase()
                    .indexOf(this.state.searchStr.toLowerCase()) > -1
                ) {
                  return app;
                }
              }
            } else {
              return app;
            }
            return "";
          });
        this.props.fetchAppsSuccess(filteredApps);
      }
    } else {
      this.props.history.push(
        "/skylinks?query=" + encodeURIComponent(this.state.searchStr)
      );
    }
  };
  onDownload = () => {
    try {
      let skylink = parseSkylink(this.state.searchStr)
      //alert("skylink" + skylink)
      launchSkyLink(skylink, this.props.snUserSetting);
    }
    catch (e) {
      this.setState({ invalidSkylink: true })
    }
  };

  changePublicPortal = (portal) => {
    document.location.href = document.location.href.replace(
      document.location.origin,
      (new URL(portal)).origin
    );
  }

  handleLogoClick = (evt) => {
    this.props.snPublicHash && evt.preventDefault();
  }

  savePublicSpace = async () => {
    this.props.setLoaderDisplay(true);
    const publicHashData = await getPublicApps(this.props.snPublicHash);
    const skappListToSave = getAllPublicApps(publicHashData.data, this.props.snPublicInMemory.addedSkapps, this.props.snPublicInMemory.deletedSkapps);
    publicHashData.history[publicHashData.history.length - 1].skylink = this.props.snPublicHash;
    publicHashData.history.push({
      creationDate: new Date()
    });
    publicHashData.data = skappListToSave;
    const skylinkListFile = getSkylinkPublicShareFile(this.props.userSession, publicHashData);
    const portal = document.location.origin.indexOf("localhost") === -1 ? document.location.origin : DEFAULT_PORTAL;
    const uploadedContent = await new SkynetClient(portal).upload(skylinkListFile);
    this.props.setLoaderDisplay(false);
    const newUrl = document.location.href.replace(
      this.props.snPublicHash,
      uploadedContent.skylink
    );
    this.setState({
      showInfoModal: true,
      infoModalContent: newUrl,
      onInfoModalClose: () => {
        this.setState({ showInfoModal: false });
        document.location.href = newUrl;
      }
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <AppBar
          position="fixed"
          className={classes.appBar + " topbar-container"}
          color="inherit"
        >
          <Toolbar className={clsx({
            "d-none": !this.props.snTopbarDisplay,
          })}>
            <Grid container spacing={1} alignItems="center">
              {this.props.snShowDesktopMenu && (

                <Grid item xs={1} sm={2} className="hidden-sm-up center-flex-div-content"
                >
                  <MenuIcon onClick={this.props.toggleMobileMenuDisplay} />
                </Grid>
              )}
              <Grid item xs={1} sm={2} className="p-top10">
                <div className="ribbon hidden-xs-dn"><span>BETA</span></div>
                <NavLink className="sm-up-logo" to="/" onClick={this.handleLogoClick}>
                  <img
                    src={skyapplogo}
                    alt="SkySpaces"
                    className="cursor-pointer hidden-xs-dn"
                    height="40"
                    width="170"
                  ></img>
                  <img
                    src={skyapplogo_only}
                    alt="SkySpaces"
                    className="cursor-pointer hidden-sm-up"
                    height="30"
                    width="30"
                  ></img>
                </NavLink>
              </Grid>
              {(this.props.person != null || this.props.snPublicHash) && (
                <>
                  <Grid item xs={7} sm={7} className="topbar-srch-grid">
                    <div className="float-center">
                      <form onSubmit={this.triggerSearch}>
                        <TextField
                          id="filled-secondary"
                          name="searchKey"
                          autoComplete="off"
                          variant="outlined"
                          className="topbar-search-field"
                          placeholder="Search in Spaces or Download Skylink"
                          onChange={(evt) =>
                            this.setState({ searchStr: evt.target.value })
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </form>
                    </div>
                  </Grid>
                  <Grid item xs={this.props.snPublicHash ? 3 : 1} sm={this.props.snPublicHash ? 2 : 1}>
                    <Tooltip title="Download Skylink Content" arrow>
                      <CloudDownloadOutlinedIcon style={{ color: APP_BG_COLOR, fontSize: 35, cursor: 'pointer' }} onClick={this.onDownload} />
                    </Tooltip>
                    {this.props.snPublicHash && (
                      <>
                        <Button
                          variant="contained"
                          onClick={this.savePublicSpace}
                          color="primary"
                          className="btn-bg-color hidden-xs-dn"
                          style={{ marginLeft: 5 }}
                        >
                          Save
                    </Button>
                        <SaveOutlinedIcon className="hidden-sm-up" style={{ color: APP_BG_COLOR }}
                          onClick={this.savePublicSpace}
                        />
                      </>
                    )}
                  </Grid>
                </>
              )}

              <Grid
                item
                sm={this.props.person != null ? 2 : (this.props.snPublicHash != null ? 1 : 10)}
                className="hidden-xs-dn"
              >
                <div className="top-icon-container float-right">
                  <Tooltip title="Launch SkyApps" arrow>
                    <IconButton
                      onClick={() => window.open(SKYNETHUB_PORTAL + "hns/skyapps/")}
                    >
                      <AppsOutlinedIcon style={{ color: APP_BG_COLOR }} />
                    </IconButton>
                  </Tooltip>
                  {!this.props.snShowDesktopMenu && (

                    <FormControl className={classes.portalFormControl}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="pulic-share-portal"
                        value="Change Portal"
                        onChange={(evt) => this.changePublicPortal(evt.target.value)}
                      >
                        <MenuItem className="d-none" value="Change Portal">
                          Change Portal
          </MenuItem>
                        {document.location.origin.indexOf("localhost") > -1 && (
                          <MenuItem value={document.location.origin}>
                            {document.location.origin}
                          </MenuItem>
                        )}
                        {this.props.snPortalsList &&
                          this.props.snPortalsList.portals.map((obj, index) => (
                            <MenuItem key={index} value={obj.url}>
                              {obj.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                  {this.props.snShowDesktopMenu && (
                    // TODO: need to create a reducer for signin component display
                    <SnSignin />
                  )}
                </div>
              </Grid>
              <Grid
                item
                xs={this.props.person != null ? 2 : 10}
                className="hidden-sm-up"
              >
                <div className="top-icon-container float-right">
                  {this.props.snShowDesktopMenu && (
                    // TODO: need to create a reducer for signin component display
                    <SnSignin />
                  )}
                </div>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.invalidSkylink}
          autoHideDuration={3000}
          onClose={() => this.setState({ invalidSkylink: false })}
          TransitionComponent={"Fade"}
        >
          <Alert onClose={() => this.setState({ invalidSkylink: false })} severity="error">
            Invalid Skylink ! Please enter valid 46 character skylink to Download.
      </Alert>
        </Snackbar>
        <SnInfoModal
          open={this.state.showInfoModal}
          onClose={this.state.onInfoModalClose}
          title="Public Share Link"
          type="public-share"
          content={this.state.infoModalContent}
        />
      </>
    );
  }
}

export default withRouter(
  withStyles(useStyles)(
    connect(mapStateToProps, matchDispatcherToProps)(SnTopBar)
  )
);
