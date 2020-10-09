import React from "react";
import Dialog from "@material-ui/core/Dialog";
import ImageGallery from "react-image-gallery";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DoneIcon from "@material-ui/icons/Done";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SnCarousalModal(props) {
  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="false"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle> */}
        <DialogContent>
          <ImageGallery items={props.items} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.onClose}
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
    </>
  );
}
