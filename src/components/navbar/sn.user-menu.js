import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import ArrowDropDownSharpIcon from "@material-ui/icons/ArrowDropDownSharp";
// import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { makeStyles } from "@material-ui/core/styles";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Box from "@material-ui/core/Box";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import SettingsIcon from "@material-ui/icons/Settings";
import BackupIcon from "@material-ui/icons/Backup";
import HistoryIcon from "@material-ui/icons/History";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Switch from "@material-ui/core/Switch";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutPerson } from "../../reducers/actions/sn.person.action";

const useStyles = makeStyles((theme) => ({
  menuTop: {
    marginTop: 25,
  },
  profilePicStyling: {
    // boxShadow: "0px 0px 5px 8px rgba(50, 50, 50, 0.14)",
    boxShadow: "0 0 10px rgba(0,0,0,.4)",
    backgroundColor: "white",
    borderRadius: "50%",
    width: 90,
    height: 90,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    color: theme.palette.primary.main,
    cursor: "pointer",
    fontSize: 45,
    marginTop: 30,
    marginLeft: 65,
    marginRight: 65,
  },
  camereIconContainer: {
    width: 25,
    height: 25,
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    position: "relative",
    left: 123,
    top: -20,
  },
  userIdStyle: {
    fontSize: 14,
    color: theme.palette.linksColor,
    fontWeight: 500,
  },
  userNameStyle: {
    fontSize: 18,
    color: theme.palette.linksColor,
    fontWeight: 500,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    paddingBottom: 20,
  },
  menuListContainers: {
    display: "flex",
    fontSize: 16,
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
    color: theme.palette.linksColor,
    cursor: "pointer"
  },
}));

function UserMenu(props) {
  const { userMenu, setUserMenu } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const stPerson = useSelector((state) => state.person);
  const stUserSession = useSelector((state) => state.userSession);

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const logout = () => {
    dispatch(logoutPerson(stUserSession));
  }

  const showPublicKey = () => {
    userMenuClose();
    props.onShowSkyDbPublicKey();
  };

  return (
    <>
      <Popover
        className={classes.menuTop}
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: "py-8",
        }}
      >
        <Box p={2}>
          <div
            className={classes.profilePicStyling}
            onClick={() => history.push("/profile")}
          >
            {stPerson.username.charAt(0).toUpperCase()}
          </div>
          <div className={classes.camereIconContainer}>
            <CameraAltIcon style={{ fontSize: 13, color: "white" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <Typography className={classes.userIdStyle}>User ID</Typography>
            <div>
              <Typography className={classes.userNameStyle}>
                USER NAME
              </Typography>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <Link to="/settings">
              <div className={classes.menuListContainers} onClick={userMenuClose}>
                {" "}
                <SettingsIcon style={{ fontSize: 18 }} />
                <div style={{ paddingLeft: 20 }}>
                  <Typography variant="span">Setting</Typography>
                </div>
              </div>
            </Link>
            {/* <div className={classes.menuListContainers} onClick={userMenuClose}>
              <BackupIcon style={{ fontSize: 18 }} />
              <div style={{ paddingLeft: 20 }}>
                <Typography variant="span">Backup</Typography>
              </div>
            </div> */}
            <Link to="/history">
              <div className={classes.menuListContainers} onClick={userMenuClose}>
                <HistoryIcon style={{ fontSize: 18 }} />
                <div style={{ paddingLeft: 20 }}>
                  <Typography variant="span">History</Typography>
                </div>
              </div>
            </Link>
            <div
              className={classes.menuListContainers}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Brightness4Icon style={{ fontSize: 18 }} />
                <div style={{ paddingLeft: 20 }}>
                  <Typography variant="span">Dark mode</Typography>
                </div>
              </div>
              <div style={{ marginLeft: 40 }}>
                <Switch
                  name="checkedA"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              </div>
            </div>
            <div className={classes.menuListContainers}
              onClick={showPublicKey}>
              <VisibilityIcon style={{ fontSize: 18 }} />
              <div style={{ paddingLeft: 20 }}>
                <Typography variant="span">Show Skydb Public Key</Typography>
              </div>
            </div>
            <div className={classes.menuListContainers}
              onClick={logout}>
              <ExitToAppIcon style={{ fontSize: 18 }} />
              <div style={{ paddingLeft: 20 }}>
                <Typography variant="span">Sign out</Typography>
              </div>
            </div>
          </div>
        </Box>
      </Popover>
    </>
  );
}

export default UserMenu;
