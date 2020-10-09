import React from "react";
import Button from "@material-ui/core/Button";
import { ValidatorForm } from "react-material-ui-form-validator";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  bsAddDeleteSkySpace,
  bsRenameSkySpace,
} from "../../blockstack/blockstack-api";
import { connect } from "react-redux";
import {
  mapStateToProps,
  matchDispatcherToProps,
} from "./sn.add-skyspace.modal.container";
import { ADD_SKYSPACE, RENAME_SKYSPACE } from "../../sn.constants";

class SnAddSkyspaceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skyspaceName: null,
    };
  }

  handleChange = (evt) => {
    this.setState({
      skyspaceName: evt.target.value,
    });
  };

  createSkyspace = async () => {
    this.props.setLoaderDisplay(true);
    await bsAddDeleteSkySpace(this.props.userSession, this.state.skyspaceName);
    this.props.setLoaderDisplay(false);
    this.props.fetchSkyspaceList();
    this.closeModal();
  };

  componentDidUpdate() {
    console.log("skyspace modal component did update");
    if (
      this.props.type === RENAME_SKYSPACE &&
      this.state.skyspaceName == null
    ) {
      this.setState({
        skyspaceName: this.props.skyspaceName,
      });
    } else if (this.props.type === "" && this.state.skyspaceName != null) {
      this.setState({
        skyspaceName: null,
      });
    }
  }

  renameSkyspace = async () => {
    console.log("Will create skyspace");
    this.props.setLoaderDisplay(true);
    await bsRenameSkySpace(
      this.props.userSession,
      this.props.skyspaceName,
      this.state.skyspaceName
    );
    this.props.fetchSkyspaceDetail();
    this.props.fetchSkyspaceList();
    this.props.setLoaderDisplay(false);
    this.closeModal();
  };

  closeModal = () => {
    this.setState({
      skyspaceName: null,
    });
    this.props.handleClose();
  };

  handleSubmit = ()=>{
    switch(this.props.type){
      case ADD_SKYSPACE:
        this.createSkyspace();
        break;
      case RENAME_SKYSPACE:
        this.renameSkyspace();
        break;
      default:
        this.closeModal();
    }
  }

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
              : "Add New Skyspace"}
          </DialogTitle>
          <DialogContent>
          <ValidatorForm
            onSubmit={this.handleSubmit}
          >
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Enter Skyspace Name"
              fullWidth
              value={this.state.skyspaceName}
              onChange={this.handleChange}
            />
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeModal} color="primary"
            className="btn-bg-color"
            variant="contained"
            >
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary"
            className="btn-bg-color"
            variant="contained"
            >
              {this.props.type === ADD_SKYSPACE ? "Create" : "Rename"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  matchDispatcherToProps
)(SnAddSkyspaceModal);
