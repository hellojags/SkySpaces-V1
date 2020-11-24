import React from "react";
import leftMenuStyles from "./sn.left-menu.styles";
import { AiOutlineUpload } from "react-icons/ai";
import editDocIcon from "./images/writing.png";
import { BiCoinStack } from "react-icons/bi";
import { ImTree } from "react-icons/im";
import { FaShareSquare } from "react-icons/fa";
import BackupIcon from "@material-ui/icons/Backup";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import VerticalSplitOutlinedIcon from "@material-ui/icons/VerticalSplitOutlined";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import WifiIcon from "@material-ui/icons/Wifi";
import Hidden from "@material-ui/core/Hidden";
import { withStyles } from "@material-ui/core/styles";
import AppsOutlinedIcon from "@material-ui/icons/AppsOutlined";
import Drawer from "@material-ui/core/Drawer";
import { DEFAULT_PORTAL } from "../../sn.constants";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import AddToPhotosOutlinedIcon from '@material-ui/icons/AddToPhotosOutlined';
import ListItem from "@material-ui/core/ListItem";
import HistoryOutlinedIcon from "@material-ui/icons/HistoryOutlined";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import skyapplogo from "../../SkySpaces_logo.png";
import ListItemText from "@material-ui/core/ListItemText";
import BackupOutlinedIcon from "@material-ui/icons/BackupOutlined";
import SnSkySpaceMenu from "./sn.skyspace-menu";
import { NavLink } from "react-router-dom";
import { APP_BG_COLOR } from "../../sn.constants";
import { connect } from "react-redux";
import builtWithSiaLogo from '../../Sia.svg';
import {
  mapStateToProps,
  matchDispatcherToProps,
} from "./sn.left-menu.container";
import { Typography } from "@material-ui/core";
import InnerIcon from "./images/icon.jpeg";


const drawerWidth = 300;
const useStyles = (theme) => ({
  root: {
    display: "flex",
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

class SnLeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.menuBar = this.menuBar.bind(this);
  }

  menuBar(classes, isMobile) {
    return (
      <React.Fragment>
        <div className={this.props.classes.toolbar}>
          <div className="banner-text hidden-sm-up">
            <div className="ribbon"><span>BETA</span></div>
            <img
              src={skyapplogo}
              alt="SkySpaces"
              className="cursor-pointer hidden-sm-up center"
              height="40"
              width="170"
            ></img>
          </div>
        </div>
        <List className="left-menu-list-root">
          <ListItem className="appstore-mobile-link hidden-sm-up">
            <ListItemText>
              <Link rel="noopener noreferrer" target="_blank" href="https://blog.sia.tech/own-your-space-eae33a2dbbbc" style={{ color: APP_BG_COLOR }}>Blog</Link>
            </ListItemText>
          </ListItem>
          <ListItem
            button
            className="appstore-mobile-link hidden-sm-up"
            onClick={() => {
              this.props.toggleMobileMenuDisplay();
              window.open("https://skyapps.hns.siasky.net");
            }}
          >
            <ListItemIcon>
              <AppsOutlinedIcon style={{ color: APP_BG_COLOR }} />
            </ListItemIcon>
            <ListItemText
              style={{ color: APP_BG_COLOR }}
              primary="SkyApps"
            />
          </ListItem>
          {this.props.person != null && (
            <>
              <NavLink
                activeClassName="active"
                className="nav-link"
                onClick={() => isMobile && this.props.toggleMobileMenuDisplay()}
                to="/upload"
              >
                <ListItem button>
                  <ListItemIcon>
                    <BackupOutlinedIcon style={{ color: APP_BG_COLOR }} />
                  </ListItemIcon>
                  <ListItemText
                    style={{ color: APP_BG_COLOR }}
                    primary="Upload"
                  />
                </ListItem>
              </NavLink>
              <NavLink
                activeClassName="active"
                className="nav-link"
                onClick={() => isMobile && this.props.toggleMobileMenuDisplay()}
                to="/register"
              >
                <ListItem button>
                  <ListItemIcon>
                    <AddToPhotosOutlinedIcon style={{ color: APP_BG_COLOR }} />
                  </ListItemIcon>
                  <ListItemText
                    style={{ color: APP_BG_COLOR }}
                    primary="Add Skylink"
                  />
                </ListItem>
              </NavLink>
              <NavLink
                activeClassName="active"
                className="nav-link"
                onClick={() => isMobile && this.props.toggleMobileMenuDisplay()}
                to="/history"
              >
                <ListItem button>
                  <ListItemIcon>
                    <HistoryOutlinedIcon style={{ color: APP_BG_COLOR }} />
                  </ListItemIcon>
                  <ListItemText
                    style={{ color: APP_BG_COLOR }}
                    primary="Activity History"
                  />
                </ListItem>
              </NavLink>
            </>
          )}
          <>
            {this.props.person != null && (
              <SnSkySpaceMenu
                isMobile={isMobile}
                toggleMobileMenuDisplay={this.toggleMobileMenuDisplay}
              />
            )}
          </>
        </List>

        <div className="fixfooter">
          <div className={this.props.classes.FooterText}>
            &copy; 2020 SkySpaces
                            {/* <a 
                            href="https://github.com/skynethubio/SkySpaces" 
                            target="_blank"
                            rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faGithub} />
                            </a> */}
          </div>
          <a href="https://sia.tech/" target="_blank"
            rel="noopener noreferrer">
            <img src={builtWithSiaLogo} alt="Built With Sia" height="50" width="50" />
          </a>
        </div>
      </React.Fragment>
    );
  }

  drawer = () => (

    <>
      {/* <Header /> */}
      <div className="main-example">
        <div className={this.props.classes.sideNavContainer}>
          {/* for section one */}

          <div className={this.props.classes.linksStyles}>
            <AiOutlineUpload className={this.props.classes.iconStyling} />
            <NavLink to="/upload"
              activeClassName="active"
              className={this.props.classes.linkName}>
              <Typography variant="span">
                Upload
            </Typography>
            </NavLink>
          </div>

          <div className={this.props.classes.linksStyles}>
            <AddBoxOutlinedIcon className={this.props.classes.iconStyling} />
            <NavLink to="/register"
              activeClassName="active"
              className={this.props.classes.linkName}>
              <Typography variant="span">
                New
            </Typography>
            </NavLink>
          </div>

          {/*  <div className={this.props.classes.linksStyles}>
            <img
              src={editDocIcon}
              className={this.props.classes.iconStyling}
              style={{ height: "20px" }}
            />
            <Typography variant="span" className={this.props.classes.linkName}>
              Register
            </Typography>
          </div> */}

          <>
            {this.props.person != null && (
              <SnSkySpaceMenu
                // isMobile={isMobile}
                toggleMobileMenuDisplay={this.toggleMobileMenuDisplay}
              />
            )}
          </>

          <div style={{ paddingTop: "30px" }}>
            <div className={this.props.classes.image_logo_sideBarfooter}>
              <img
                src="https://skyspaces.io/static/media/Sia.7dd07c88.svg"
                height="60"
                width="60"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  render() {
    const { classes } = this.props;

    return (

      this.props.showDesktopMenu && this.props.person &&
      <nav className={this.props.classes.drawer} aria-label="mailbox folders">
        {/* matches */true ? (
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {this.drawer()}
            </Drawer>
          </Hidden>
        ) : null}
      </nav>

    );


    return (
      <React.Fragment>
        <Hidden smUp={true} implementation="css">
          <Drawer
            variant="temporary"
            anchor={this.props.theme.direction === "rtl" ? "right" : "left"}
            open={this.props.showMobileMenu}
            onClose={this.props.toggleMobileMenuDisplay}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {this.menuBar(classes, true)}
          </Drawer>
        </Hidden>
        {this.props.showDesktopMenu && (

          <Hidden xsDown implementation="css">
            <Drawer
              className={this.props.classes.drawer}
              variant="persistent"
              anchor="left"
              open={this.props.showDesktopMenu}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {this.menuBar(classes)}
            </Drawer>
          </Hidden>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(leftMenuStyles, { withTheme: true })(
  connect(mapStateToProps, matchDispatcherToProps)(SnLeftMenu)
);
