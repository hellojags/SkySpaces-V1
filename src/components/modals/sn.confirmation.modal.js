import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import BlockIcon from '@material-ui/icons/Block';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DoneIcon from "@material-ui/icons/Done";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function SnConfirmationModal(props) {
        return (
          <Dialog
            open={props.open}
            onClose={props.onNo}
            TransitionComponent={Transition}
            keepMounted
            maxWidth="lg"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {props.content}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={props.onNo}
                autoFocus
                variant="contained"
                color="secondary"
                className="btn-bg-color"
                startIcon={<BlockIcon />}
              >
                Cancel
              </Button>
              <Button
                onClick={props.onYes}
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