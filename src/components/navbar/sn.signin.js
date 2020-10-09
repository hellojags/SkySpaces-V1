import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import { mapStateToProps, matchDispatcherToProps } from "./sn.topbar.container";
import { withRouter } from "react-router";
import { showBlockstackConnect, authenticate } from "@blockstack/connect";
import { APP_BG_COLOR, PUBLIC_TO_ACC_QUERY_PARAM } from "../../sn.constants";
import { Tooltip } from "@material-ui/core";
import { authOrigin, appDetails, userSession } from "../../blockstack/constants";
import { bsSavePublicKey } from "../../blockstack/blockstack-api";

class SnSignin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  doSignIn = () => {
    const authOptions = {
      redirectTo: "/",
      manifestPath: '/manifest.json',
      authOrigin,
      userSession,
      sendToSignIn: true,
      finished: ({ userSession }) => {
        this.props.setUserSession(userSession);
        bsSavePublicKey(userSession);
        this.props.setPersonGetOtherData(userSession.loadUserData());
      },
      appDetails: appDetails,
    };
    //this.props.userSession.redirectToSignIn();
    authenticate(authOptions);
  };
  doSignUp = () => {

    const authOptions = {
      redirectTo: "/",
      manifestPath: '/manifest.json',
      authOrigin,
      userSession,
      finished: ({ userSession }) => {
        this.props.setUserSession(userSession);
        this.props.setPersonGetOtherData(userSession.loadUserData());
      },
      appDetails: appDetails,
    };
    showBlockstackConnect(authOptions);
  };
  componentDidMount() {
    if (this.props.person == null) {
      if (this.props.userSession.isSignInPending()) {
        this.props.fetchBlockstackPerson(this.props.userSession);
      } else if (this.getPublicToAccHash() != null) {
        this.doSignUp();
      }
    }
  }

  getPublicToAccHash = () => (new URLSearchParams(this.props.location.search)).get(PUBLIC_TO_ACC_QUERY_PARAM);

  handleClick = (event) => {
    this.setState({ anchorEl: event == null ? null : event.currentTarget });
  };

  logout = () => {
    this.props.logoutPerson(this.props.userSession);
    this.handleClick();
  };

  handleSettings = () => {
    this.handleClick();
    this.props.history.push("/settings");
  };

  onDownload = () => {
    console.log("topbar download button clicked");
  };

  render() {
    return (
      <>
        {this.props.person == null && (
          <>
            <Button
              onClick={this.doSignIn}
              variant="outlined"
              className="btn-login"
            >
              Login
            </Button>
            <Button
              onClick={this.doSignUp}
              variant="contained"
              className="btn-signup"
            >
              Sign Up
            </Button>
            {/* <Grid container spacing={1} >
            <Grid item>
              <Button onClick={this.doSignIn} variant="outlined" style={{borderColor:APP_BG_COLOR, color: APP_BG_COLOR, fontWeight: "bold" }}>
                Login
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={this.doSignUp} variant="contained" style={{ background: APP_BG_COLOR, color: "white", fontWeight: "bold" }}>
                Sign Up
              </Button>
            </Grid>
          </Grid> */}
          </>
        )}
        {/* {this.props.person && (
          <>
            <Tooltip title="Download Skylink" arrow className="topbar-dwnld">
              <IconButton onClick={this.onDownload}>
                <CloudDownloadOutlinedIcon style={{ color: APP_BG_COLOR }} />
              </IconButton>
            </Tooltip>
            </>
            )} */}
        {this.props.person && (
          <>
            <Tooltip title={"Welcome " + this.props.person.username.replace(".id.blockstack", "") + " !"}>
              <Avatar
                alt="Remy Sharp"
                src=""
                className="app-bg-color cursor-pointer"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={(evt) => this.handleClick(evt)}
              >
                {this.props.person.username.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={() => this.handleClick()}
              className="avatar-menu"
            >
              <div style={{ color: APP_BG_COLOR, fontWeight: "bold" }}>
                {/* UserName: {this.props.person.profile.name} <br/> */}
                UserID: {this.props.person.username}
              </div>

              <MenuItem onClick={() => this.handleSettings()}>
                Settings
              </MenuItem>
              <MenuItem onClick={this.logout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  matchDispatcherToProps
)(withRouter(SnSignin));
