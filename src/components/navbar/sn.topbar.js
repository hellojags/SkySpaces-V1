import React from "react";
import "./sn.topbar.css";
import skyapplogo from "../../SkySpaces_g.png";
import FormControl from '@material-ui/core/FormControl';
import skyapplogo_only from "../../SkySpaces_logo_transparent_small.png";
import AppsIcon from "@material-ui/icons/Apps";
import SmallLogo from "./images/smLogo.png";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import MuiAlert from "@material-ui/lab/Alert";
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles, withTheme } from "@material-ui/core/styles";
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
import { Drawer } from "@material-ui/core";

const drawerWidth = 240;
const useStyles = (theme) => ({
  root: {
    display: "flex",
  },
  headerBgColorSet: {
    backgroundColor: theme.palette.headerBgColor,
  },
  searchBarBg: {
    backgroundColor: theme.palette.centerBar,
    // border:"none"
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
  searchBarForm: {
    width: "100%",
    display: "flex"
  },
  appLogo: {
    color: theme.palette.mediumGray,
    fontSize: 35,
    marginRight: 20,
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
      anchor: "",
      isTrue: false,
      activeDarkBck: false,
      onInfoModalClose: () => this.setState({ showInfoModal: false })
    };
  }

  setActiveDarkBck = (val)=>this.setState({activeDarkBck: val});

  componentDidMount(){
    let getMode = localStorage.getItem("darkMode");
    if (getMode === "true") {
      this.setActiveDarkBck(true);
    } else {
      this.setActiveDarkBck(false);
    }
  }

  getSkylinkIdxObject = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    getSkylinkIdxObject(this.props.userSession).then((skyLinkIdxObject) => {
      getSkylink(this.props.userSession, skyLinkIdxObject.skhubIdList[1]);
    });
  };

  triggerSearch = async (evt) => {
    console.log("on trigger search");

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
    console.log("ondownload");
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

  renderChangePortal = (value) => <FormControl className={this.props.classes.portalFormControl}>
    <Select
      labelId="demo-simple-select-label"
      id="pulic-share-portal"
      value={value}
      onChange={(evt) => this.changePublicPortal(evt.target.value)}
    >
      <MenuItem className="d-none" value={value}>
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

  render() {
    const { classes } = this.props;
    return (
      <>
        {this.props.snTopbarDisplay && <div>
          <div className="container-fluid main-container">
            <nav className={`navbar navbar-light hdr-nvbr-main ${classes.headerBgColorSet}`}>
              {this.props.person != null && (
                <Drawer anchor={this.state.anchor} isTrue={this.state.isTrue} setIsTrue={(evt) => this.setState({ isTrue: evt })} />
              )}

              {/* {this.props.person!=null && <button
                className="navbar-toggler togl-btn-navbr"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>} */}

              <a
                className={`${"navbar-brand"} ${
                  this.props.person==null ? "auth-navi-brand" : "navi-brnd"
              } ${this.props.person==null && "logoAlignMent"}`}
              >
                {/* logo */}
                <img
                  style={{ cursor: "pointer" }}
                  onClick={this.handleLogoClick}
                  src="https://skyspaces.io/static/media/SkySpaces_g.531bd028.png"
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt=""
                  loading="lazy"
                  height="40"
                  width="170"
                />

                {/* search input */}
                {(this.props.person != null || this.props.snPublicHash) && (
                  <>
                    <form onSubmit={this.triggerSearch} className={classes.searchBarForm}>
                      <div className="search_main_div" style={{marginLeft: "auto"}}>
                        <span>
                          <i className="fas fa-search srch-icon-inside-field-input"></i>
                        </span>

                        <input
                          className={`form-control mr-sm-2 srch_inpt ${classes.searchBarBg}`}
                          style={{
                            border: `${
                              this.state.activeDarkBck === true
                                ? "none"
                                : "1px solid lightgray"
                            }`,
                          }}
                          type="search"
                          placeholder="Search in SkySpaces or download Skylink"
                          aria-label="Search"
                          onChange={(evt) =>
                            this.setState({ searchStr: evt.target.value })
                          }
                        />
                      {/* search inside nav-brand */}
                      <div className="srch_btn_main_div">
                        <button className="btn srch_btn_nvbar" type="button" onClick={this.onDownload}>
                          <label for="hidden-search-inpt">
                            <i className="fa fa-download icon_download_nvbar"></i>
                          </label>
                        </button>
                        <input type="file" id="hidden-search-inpt" />
                      </div>
                      </div>

                    </form>
                  </>
                )}
              </a>

              <a className="small_logo_nvbrnd">
              {/* small logo */}
              <img
                style={{ cursor: "pointer" }}
                onClick={this.handleLogoClick}
                src={SmallLogo}
                width="30"
                height="30"
                className=" smallLogo_header"
                alt=""
                loading="lazy"
                height="35"
                width="35"
              />
            </a>

            {this.props.person!=null && (
              <div className="srch_btn_out_main_div">
                <button className="btn srch_btn_nvbar">
                  <label for="hidden-search-inpt">
                    <i className="fa fa-download icon_download_nvbar"></i>
                  </label>
                </button>
                <input type="file" id="hidden-search-inpt" />
              </div>
            )}
            
              {/*(this.props.person != null || this.props.snPublicHash) && (
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
                  <Grid item xs={this.props.snPublicHash ? 2 : 1} sm={this.props.snPublicHash ? 2 : 1}>
                    <Tooltip title="Download Skylink Content" arrow>
                      <CloudDownloadOutlinedIcon style={{ color: APP_BG_COLOR, fontSize: 35, cursor: 'pointer' }} onClick={this.onDownload} />
                    </Tooltip>
                  </Grid>
                </>
                        )*/}

              {/* <Grid
                item
                sm={this.props.person != null ? 2 : (this.props.snPublicHash != null ? 1 : 10)}
                className="hidden-xs-dn"
              > */}
              <div
                className="btn-icons-nvbr-div"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Link justify="center" rel="noopener noreferrer" target="_blank" href="https://blog.sia.tech/own-your-space-eae33a2dbbbc" style={{ color: APP_BG_COLOR }}>Blog</Link>
                <div className="butn-th-main-div">
                  <button className="btn th_btn_nvbar">
                    <AppsIcon
                      className={this.props.classes.appLogo}
                    />
                  </button>
                </div>
                {this.props.snPublicHash && (
                  this.renderChangePortal("Change Portal")
                )}
                {this.props.snShowDesktopMenu && this.props.snPublicHash==null && (
                  // TODO: need to create a reducer for signin component display
                  <SnSignin />
                )}
              </div>
              {/* </Grid> */}
              {/* <Grid
                item
                xs={(this.props.person != null || this.props.snPublicHash != null) ? 2 : 10}
                className="hidden-sm-up"
              >
                <div className="top-icon-container float-right">
                  {this.props.snShowDesktopMenu && this.props.snPublicHash==null && (
                    // TODO: need to create a reducer for signin component display
                    <SnSignin />
                  )}
                  {this.props.snPublicHash && this.renderChangePortal("")}
                </div>
              </Grid> */}
            </nav>
          </div>
        </div>
        }
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
