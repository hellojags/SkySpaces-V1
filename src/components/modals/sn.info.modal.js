import React from "react";
import Dialog from "@material-ui/core/Dialog";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DoneIcon from "@material-ui/icons/Done";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import { APP_BG_COLOR } from "../../sn.constants";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class SnInfoModal extends React.Component {
  displayContent = ()=> {
    switch(this.props.type){
      case 'public-share': 
        return (
          <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Skylinks are available at the following public link :
          </DialogContentText>
          <DialogContentText>
            <>
            {this.props.content}<Tooltip title="Copy Skylink to clipboard" arrow>
                    <FileCopyOutlinedIcon
                      onClick={()=>navigator.clipboard.writeText(this.props.content)}
                      className="cursor-pointer"
                      style={{ color: APP_BG_COLOR, paddingLeft: 5 }}
                    />
                  </Tooltip>
                  </>
          </DialogContentText>
        </DialogContent>
        );
      default:
        return (
          <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.props.content}
          </DialogContentText>
        </DialogContent>
        );
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
        {this.displayContent()}
        <DialogActions>
          <Button
            onClick={this.props.onClose}
            autoFocus
            variant="contained"
            color="primary"
            className="btn-bg-color"
            startIcon={<DoneIcon />}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default SnInfoModal;
