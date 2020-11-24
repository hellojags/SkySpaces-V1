import React from "react";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import SnShareSkyspaceModal from "../modals/sn.share-skyspace.modal";
import InnerIcon from "./images/icon.jpeg";
import SnConfirmationModal from "../modals/sn.confirmation.modal";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { BiCoinStack } from "react-icons/bi";
import Tooltip from "@material-ui/core/Tooltip";
import RefreshOutlinedIcon from "@material-ui/icons/RefreshOutlined";
import SnAddSkyspaceModal from "../modals/sn.add-skyspace.modal";
import {
  bsAddDeleteSkySpace,
  getSkyspaceApps,
  putDummyFile,
  deleteDummyFile, bsGetSharedWithObj
} from "../../blockstack/blockstack-api";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {
  APP_BG_COLOR,
  ADD_SKYSPACE,
  RENAME_SKYSPACE,
} from "../../sn.constants";
import { Link, NavLink } from "react-router-dom";
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
import cliTruncate from "cli-truncate";
import SnImportSharedSpaceModal from "../modals/sn.import-shared-space.modal";
import { Accordion, AccordionDetails, AccordionSummary, Typography, withStyles } from "@material-ui/core";
import leftMenuStyles from "./sn.left-menu.styles";
import { FaShareSquare } from "react-icons/fa";
import { ImTree } from "react-icons/im";

class SnSkySpaceMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddSkyspace: false,
      sharedWithObj: null,
      showConfModal: false,
      showShareSkyspaceModal: false,
      confModalDescription: null,
      skyspaceToDel: null,
      skyspaceToShare: null,
      showImportSkyspaceModal: false,
      skyspaceModal: {
        title: "Add New Skyspace",
        skyspaceName: null,
        type: ADD_SKYSPACE,
      },
    };
  }

  importSharedSpace = () => {
    this.setState({ showImportSkyspaceModal: true });
  };

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

  onDelete = (evt, skyspaceToDel) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.setState({
      showConfModal: true,
      skyspaceToDel,
      confModalDescription: "This action will permanently remove your " + skyspaceToDel + " skyspace. Do you want to continue?"
    });
  }

  launchShareModal = async (evt, skyspaceName) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.props.setLoaderDisplay(true);
    const sharedWithObj = await bsGetSharedWithObj(this.props.userSession);
    this.props.setLoaderDisplay(false);
    this.setState({
      showShareSkyspaceModal: true,
      skyspaceToShare: skyspaceName,
      sharedWithObj: sharedWithObj
    });
  }

  render() {
    return (
      <>
        <div className={this.props.classes.spaceLinkStyle}>
          <span>
            <BiCoinStack className={this.props.classes.spaceIcon} />
            <Typography variant="span">
              Spaces
              </Typography>
          </span>
          <span>
            <RefreshOutlinedIcon
              className={this.props.classes.spaceIcon}
              onClick={this.refreshSkyspace}
            />
            <AddCircleOutlineIcon className={this.props.classes.spaceIcon} onClick={this.addSkyspace} />
          </span>
        </div>

        {this.props.skyspaceList != null && (
          this.props.skyspaceList.map((skyspace) => (
            <div className={this.props.classes.spacesCont} key={skyspace}>
              <NavLink
                activeClassName="active"
                onClick={() =>
                  this.props.isMobile && this.props.toggleMobileMenuDisplay()
                }
                to={"/skyspace/" + skyspace}
              >
                <span>
                  <BookmarkIcon className={this.props.classes.spaceBookIcon} />
                  <Typography variant="span" className={this.props.classes.spacelinkName}>
                    {cliTruncate(skyspace, 10)}
                    <span className={this.props.classes.spacesNumber}>
                      ({this.props.snSkyspaceAppCount && this.props.snSkyspaceAppCount[skyspace]})
                </span>
                  </Typography>
                </span>
              </NavLink>
              <span>
                {/* <EditOutlinedIcon className={this.props.classes.editIconStyle} /> */}
                <EditOutlinedIcon
                  className={this.props.classes.shareIconStyle}
                  onClick={(evt) => this.renameSkySpace(evt, skyspace)}
                />
                <DeleteOutlinedIcon
                  className={this.props.classes.shareIconStyle}
                  onClick={(evt) => this.onDelete(evt, skyspace)}
                />
                <FaShareSquare className={this.props.classes.shareIconStyle}
                  onClick={(evt) => this.launchShareModal(evt, skyspace)} />
              </span>
            </div>
          ))
        )}

        <div className={this.props.classes.spaceLinkStyle}>
          <span>
            <ImTree className={this.props.classes.iconStyling} />
            <Typography variant="span">
              Shared Spaces
              </Typography>
          </span>
          <span>
            <AddCircleOutlineIcon className={this.props.classes.spaceIcon}
              onClick={this.importSharedSpace} />
          </span>
        </div>

        <div className={this.props.classes.sideProf_div}>
          {this.props.snImportedSpace?.sharedByUserList
            ?.filter(userId => this.props.snImportedSpace?.senderToSpacesMap[userId]?.skyspaceList.length > 0)
            .map((userId) => (
              <>

                <div className={this.props.classes.innerSideProf_div} key={userId}>
                  <div className={this.props.classes.icon_side_inner_div}>
                    {/* <img
                  src={InnerIcon}
                  style={{
                    width: "25px",
                    borderRadius: "100%",
                    height: "25px",
                  }}
                /> */}
                    <AccountCircleIcon className={this.props.classes.spaceIcon} />
                  </div>

                  <div style={{ paddingLeft: "20px", marginTop: "-5px" }}>
                    <span style={{ fontSize: "12px" }}>{cliTruncate(userId, 20)}</span>
                    {this.props.snImportedSpace?.senderToSpacesMap[userId]?.skyspaceList.map(skyspace => (
                      <NavLink
                        activeClassName="active"
                        key={skyspace}
                        className="imported-space-nav-link"
                        onClick={() =>
                          this.props.isMobile && this.props.toggleMobileMenuDisplay()
                        }
                        to={"/imported-spaces/" + encodeURIComponent(userId) + "/" + skyspace}
                      >
                        <div className={this.props.classes.icon_sub_title_div} >
                          {cliTruncate(skyspace, 10)}
                          {/* <span style={{ color: "#1ed660", paddingLeft: "7px" }}>
                    (13)
                  </span> */}
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </>
            ))}
        </div>

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
          sharedWithObj={this.state.sharedWithObj}
        />

        <SnImportSharedSpaceModal
          open={this.state.showImportSkyspaceModal}
          onYes={() => {
            this.setState({ showImportSkyspaceModal: false });
          }}
          userSession={this.props.userSession}
          onNo={() => this.setState({ showImportSkyspaceModal: false })}
          title={`Import Shared Space`}
        />
      </>
    );
  }
}

export default withStyles(leftMenuStyles, { withTheme: true })(
  connect(mapStateToProps, matchDispatcherToProps)(SnSkySpaceMenu)
);
