import React from "react";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import SnShareSkyspaceModal from "../modals/sn.share-skyspace.modal";
import SnConfirmationModal from "../modals/sn.confirmation.modal";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Tooltip from "@material-ui/core/Tooltip";
import RefreshOutlinedIcon from "@material-ui/icons/RefreshOutlined";
import SnAddSkyspaceModal from "../modals/sn.add-skyspace.modal";
import {
  bsAddDeleteSkySpace,
  getSkyspaceApps,
  putDummyFile,
  deleteDummyFile,
} from "../../blockstack/blockstack-api";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import {
  APP_BG_COLOR,
  ADD_SKYSPACE,
  RENAME_SKYSPACE,
} from "../../sn.constants";
import { NavLink } from "react-router-dom";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Card from "@material-ui/core/Card";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import ListItemText from "@material-ui/core/ListItemText";
import { connect } from "react-redux";
import {
  mapStateToProps,
  matchDispatcherToProps,
} from "./sn.skyspace-menu.container";

class SnSkySpaceMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddSkyspace: false,
      showConfModal: false,
      showShareSkyspaceModal: false,
      confModalDescription: null,
      skyspaceToDel: null,
      skyspaceToShare: null,
      skyspaceModal: {
        title: "Add New Skyspace",
        skyspaceName: null,
        type: ADD_SKYSPACE,
      },
    };
  }

  handleClickOpen = () => {
    this.setState({
      showAddSkyspace: true,
    });
  };

  handleClose = () => {
    this.setState({
      showAddSkyspace: false,
      skyspaceModal: {
        title: "",
        skyspaceName: "",
        type: "",
      },
    });
  };

  renameSkySpace = (evt, skyspace) => {
    evt.preventDefault();
    evt.stopPropagation();
    console.log("renameSkySpace before open modal", skyspace, window.location);
    this.setState({
      skyspaceModal: {
        title: "Rename Skyspace",
        skyspaceName: skyspace,
        type: RENAME_SKYSPACE,
      },
    });
    this.handleClickOpen();
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
    this.handleClickOpen();
  };

  deleteSkyspace = async (skyspace) => {
    this.props.setLoaderDisplay(true);
    await bsAddDeleteSkySpace(this.props.userSession, skyspace, true);
    this.props.fetchSkyspaceList();
    this.props.fetchSkyspaceDetail();
    this.props.setLoaderDisplay(false);
  };

  getSkyspace = (evt, skyspace) => {
    evt.preventDefault();
    evt.stopPropagation();
    getSkyspaceApps(this.props.userSession, skyspace);
  };

  refreshSkyspace = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.props.fetchSkyspaceList();
    this.props.fetchSkyspaceAppCount();
  };

  addDummySkyspace = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    putDummyFile(this.props.userSession);
  };

  removeDummySkyspace = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    deleteDummyFile(this.props.userSession);
  };

  onDelete = (evt, skyspaceToDel) =>{
    evt.preventDefault();
    evt.stopPropagation();
    this.setState({
      showConfModal: true,
      skyspaceToDel,
      confModalDescription: "This action will permanently remove your "+skyspaceToDel+" skyspace. Do you want to continue?"
    });
  }

  launchShareModal = (evt, skyspaceName) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.setState({
      showShareSkyspaceModal: true,
      skyspaceToShare: skyspaceName
    })
  }

  render() {
    return (
      <>
        <ListItem button component="a" className="nav-link dummy-link">
          <ListItemIcon>
            <BookmarksIcon style={{ color: APP_BG_COLOR }} />
          </ListItemIcon>
          <ListItemText style={{ color: APP_BG_COLOR }} primary="Spaces" />
          <Tooltip title="Refresh Space List" arrow>
          <RefreshOutlinedIcon
            style={{ color: APP_BG_COLOR }}
            onClick={this.refreshSkyspace}
          />
          </Tooltip>
          <Tooltip title="Add New Space" arrow>
          <AddCircleOutlineIcon
            style={{ color: APP_BG_COLOR }}
            onClick={this.addSkyspace}
          />
          </Tooltip>
        </ListItem>
        {/* <ListItem onClick={this.addDummySkyspace} className="d-none">
          <ListItemText style={{ color: APP_BG_COLOR }} primary="Add Dummy" />
        </ListItem>
        <ListItem onClick={this.removeDummySkyspace} className="d-none">
          <ListItemText style={{ color: APP_BG_COLOR }} primary="Del Dummy" />
        </ListItem> */}
        {this.props.skyspaceList != null && (
          <Card variant="outlined" className="skyspace-menu-card">
            {this.props.skyspaceList.map((skyspace) => (
              <React.Fragment key={skyspace}>
                <NavLink
                  activeClassName="active"
                  className="nav-link"
                  onClick={() =>
                    this.props.isMobile && this.props.toggleMobileMenuDisplay()
                  } 
                  to={"/skyspace/" + skyspace}
                >
                  <ListItem
                    button
                    /* onClick={(evt) => this.getSkyspace(evt, skyspace)} */
                  >
                    <BookmarkIcon style={{ color: APP_BG_COLOR }} />
                    <ListItemText
                      primary={skyspace}
                      style={{ color: APP_BG_COLOR }}
                    />
                    <span className="app-color">
                        ({this.props.snSkyspaceAppCount && this.props.snSkyspaceAppCount[skyspace]})
                    </span>
                    <EditOutlinedIcon
                      style={{ color: APP_BG_COLOR }}
                      onClick={(evt) => this.renameSkySpace(evt, skyspace)}
                    />
                    <DeleteOutlinedIcon
                      color="secondary"
                      onClick={(evt) => this.onDelete(evt, skyspace)}
                    />
                    {false && this.props.snSkyspaceAppCount && this.props.snSkyspaceAppCount[skyspace]!==0 && (
                    <ShareOutlinedIcon 
                      style={{ color: APP_BG_COLOR }}
                      onClick={(evt) => this.launchShareModal(evt, skyspace)}
                      />
                      )}
                  </ListItem>
                </NavLink>
                <Divider className="skyspace-menu-divider" component="div" />
              </React.Fragment>
            ))}
          </Card>
        )}
        <SnAddSkyspaceModal
          open={this.state.showAddSkyspace}
          title={this.state.skyspaceModal.title}
          skyspaceName={this.state.skyspaceModal.skyspaceName}
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}
          type={this.state.skyspaceModal.type}
        />
        <SnConfirmationModal
          open={this.state.showConfModal}
          onYes={() => {
            this.setState({ showConfModal: false });
            this.deleteSkyspace(this.state.skyspaceToDel);
          }}
          onNo={() => this.setState({ showConfModal: false })}
          title="Warning!"
          content={this.state.confModalDescription}
        />
        <SnShareSkyspaceModal
          open={this.state.showShareSkyspaceModal}
          onYes={() => {
            this.setState({ showShareSkyspaceModal: false });
            //this.deleteSkyspace(this.state.skyspaceToDel);
          }}
          skyspaceName={this.state.skyspaceToShare}
          userSession={this.props.userSession}
          onNo={() => this.setState({ showShareSkyspaceModal: false })}
          title={`Share Skyspace: ${this.state.skyspaceToShare}`}
          content={this.state.confModalDescription}
        />
      </>
    );
  }
}

export default connect(mapStateToProps, matchDispatcherToProps)(SnSkySpaceMenu);
