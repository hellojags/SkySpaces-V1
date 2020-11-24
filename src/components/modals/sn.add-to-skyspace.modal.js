import React from "react";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button, Chip, TextField } from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import SnCarousalMenu from "../tools/sn.carousal-menu";
import { ADD_SKYSPACE, getSkyspaceListForCarousalMenu } from "../../sn.constants";
import SnAddSkyspaceModal from "./sn.add-skyspace.modal";
import Autocomplete from "@material-ui/lab/Autocomplete";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class SnAddToSkyspaceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSkyspaces: [],
      skyspaceModal: {
        title: "Add New Skyspace",
        skyspaceName: "",
        type: ADD_SKYSPACE,
      },
      showAddSkyspace: false
    };
  }

  resetOnClose = () => {
    this.setState({
      selectedSkyspaces: [],
    });
    this.props.onClose();
  };

  save = () => {
    const selectedSkyspacesCopy = JSON.parse(
      JSON.stringify(this.state.selectedSkyspaces)
    );
    this.setState({
      selectedSkyspaces: [],
    });
    this.props.onSave(selectedSkyspacesCopy);
  };

  addSkyspace = () => {
    this.setState({
      skyspaceModal: {
        title: "Add New Skyspace",
        skyspaceName: "",
        type: ADD_SKYSPACE,
      },
    });
    this.handleAddSpaceOpen();
  };

  handleAddSpaceOpen = () => {
    this.setState({
      showAddSkyspace: true,
    });
  };

  handleAddSpaceClose = () => {
    this.setState({
      showAddSkyspace: false,
      skyspaceModal: {
        title: "",
        skyspaceName: "",
        type: "",
      },
    });
  };

  render() {
    return (
      <>
        <Dialog
          open={this.props.open}
          onClose={this.resetOnClose}
          TransitionComponent={Transition}
          keepMounted
          disableBackdropClick={this.props.disableBackdropClick ?? false}
          disableEscapeKeyDown={this.props.disableEscapeKeyDown ?? false}
          maxWidth="lg"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {this.props.title || "Add this Skylink to Skyspaces"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {!this.props.showAddSkyspace && (<SnCarousalMenu
                selectedItems={this.state.selectedSkyspaces}
                itemsObj={getSkyspaceListForCarousalMenu(
                  this.props.availableSkyspaces != null
                    ? this.props.availableSkyspaces
                    : []
                )}
                labelKey={"label"}
                onUpdate={(evt) => {
                  console.log(this.state.selectedSkyspaces);
                  this.setState({
                    selectedSkyspaces: evt,
                  });
                }}
              />)}

              {this.props.showAddSkyspace && (<Autocomplete
                multiple
                id="tags-filled"
                filterSelectedOptions
                options={this.props.availableSkyspaces || []}
                freeSolo
                onChange={(evt, value, reason) => this.setState({ selectedSkyspaces: value })}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} variant="standard" label="Select from Existing Skyspace or Add a New Skyspace" placeholder="Select from Existing Skyspace or Add a New Skyspace" />
                )}
              />)}

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.resetOnClose}
              autoFocus
              variant="contained"
              color="primary"
              className="btn-20px app-bg-color"
            >
              Cancel
          </Button>
            <Button
              onClick={this.save}
              autoFocus
              variant="contained"
              color="primary"
              className="btn-20px app-bg-color"
            >
              Save
          </Button>
          </DialogActions>
        </Dialog>
        {this.props.showAddSkyspace && (<SnAddSkyspaceModal
          open={this.state.showAddSkyspace}
          title={this.state.skyspaceModal.title}
          skyspaceName={this.state.skyspaceModal.skyspaceName}
          handleClickOpen={this.handleAddSpaceOpen}
          handleClose={this.handleAddSpaceClose}
          type={this.state.skyspaceModal.type}
        />)}
      </>
    );
  }
}

export default SnAddToSkyspaceModal;
