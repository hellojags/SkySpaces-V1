import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import BlockIcon from "@material-ui/icons/Block";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DoneIcon from "@material-ui/icons/Done";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";
import { bsShareSkyspace } from "../../blockstack/blockstack-api"; 
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SnShareSkyspaceModal(props) {
  const [recipientId, setRecipientId] = useState(null);

  const shareWithRecipient = async ()=>{
      try {
          await bsShareSkyspace(props.userSession, props.skyspaceName, recipientId);
      } catch(err) {
          console.log("share space error", err);
      }
  }

    return (
        <Dialog
        open={props.open}
        onClose={props.onNo}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {props.content}
            </DialogContentText>
            <Grid container spacing={1} direction="row">
            <Grid item xs={12}>
                <TextField
                id="recipientId"
                name="recipientId"
                label="Recipient Id"
                fullWidth
                value={recipientId}
                autoComplete="off"
                helperText="Please enter recipient blockstack ID."
                onChange={evt=>setRecipientId(evt.target.value)}
                />
            </Grid>
            </Grid>
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
                onClick={evt=>shareWithRecipient()}
                autoFocus
                disabled={recipientId==null || recipientId.trim()===""}
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
