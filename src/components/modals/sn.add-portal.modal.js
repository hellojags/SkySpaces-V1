import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  bsAddPortal,
} from "../../blockstack/blockstack-api";
import { connect } from "react-redux";
import {
  mapStateToProps,
  matchDispatcherToProps,
} from "./sn.add-portal.modal.container";
import { ADD_PORTAL, EDIT_PORTAL } from "../../sn.constants";

class SnPortalModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      portal : {
        createTS: new Date(),
        name: null,
        url: null,
      },
    };
    console.log("sn portal modal constructor");
  }

  handlePortalNameChange = (evt) => {
    this.setState({
      portal : {
        ...this.state.portal,
        name: evt.target.value,
      },
    });
  };
  handlePortalURLChange = (evt) => {
    this.setState({
      portal : {
        ...this.state.portal,
        url: evt.target.value,
      },
    });
  };

  addPortal = () => {
    console.log("Will add portal");
    this.props.setLoaderDisplay(true);
    bsAddPortal(this.props.userSession, this.state.portal).then(
      (res) => {
        console.log("reeturn value in add portal :", res);
        this.props.setLoaderDisplay(false);
        //this.props.fetchPortalsListAction();
        this.closeModal();
      }
    );
  };

  componentDidUpdate() {
    console.log("portal modal component did update");
    // if (
    //   this.props.type === EDIT_PORTAL &&
    //   this.state.portal == null
    // ) {
    //   this.setState({
    //     skyspaceName: this.props.skyspaceName,
    //   });
    // } else if (this.props.type === "" && this.state.skyspaceName != null) {
    //   this.setState({
    //     skyspaceName: null,
    //   });
    // }
  }

  // renameSkyspace = () => {
  //   console.log("Will create skyspace");
  //   this.props.setLoaderDisplay(true);
  //   renameSkySpace(
  //     this.props.userSession,
  //     this.props.skyspaceName,
  //     this.state.skyspaceName
  //   ).then((res) => {
  //     console.log("reeturn value in add skyaspace :", res);
  //     this.props.setLoaderDisplay(false);
  //     this.props.fetchSkyspaceList();
  //     this.closeModal();
  //   });
  // };

  closeModal = () => {
    this.setState({
      portal : {
        createTS: new Date(),
        name: null,
        url: null,
      },
    });
    this.props.handleClose();
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.closeModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.props.title != null && this.props.title.trim() !== ""
              ? this.props.title
              : "Add New Portal"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Enter Portal Name"
              type="email"
              fullWidth
              value={this.state.portal.name}
              onChange={this.handlePortalNameChange}
            />
          </DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="url"
              label="Enter Portal URL"
              type="email"
              fullWidth
              value={this.state.portal.url}
              onChange={this.handlePortalURLChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeModal} color="primary">
              Cancel
            </Button>
            {this.props.type === ADD_PORTAL && (
              <Button onClick={this.addPortal} color="primary">
                Add
              </Button>
            )}
            {this.props.type === EDIT_PORTAL && (
              <Button onClick={this.addPortal} color="primary">
                EDIT
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  matchDispatcherToProps
)(SnPortalModal);
