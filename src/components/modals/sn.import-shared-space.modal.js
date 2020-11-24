import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import MuiAlert from "@material-ui/lab/Alert";
import BlockIcon from "@material-ui/icons/Block";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DoneIcon from "@material-ui/icons/Done";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button, makeStyles } from "@material-ui/core";
import { importSpaceFromUserList } from "../../blockstack/blockstack-api";
import Slide from "@material-ui/core/Slide";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import { setImportedSpace } from "../../reducers/actions/sn.imported-space.action";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(1)
    },
}));

export default (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [senderId, setSenderId] = useState(null);

    const stUserSession = useSelector((state) => state.userSession);

    const importFromUser = async () => {
        dispatch(setLoaderDisplay(true));
        const importedSpace = await importSpaceFromUserList(stUserSession, [senderId]);
        dispatch(setImportedSpace(importedSpace));
        dispatch(setLoaderDisplay(false));
        setSenderId("");
        props.onNo();
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
            <DialogTitle id="alert-dialog-title">Import Shared Space</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Please enter the user-id of the user who has shared a space with you
            </DialogContentText>
                <TextField
                    id="recipientId"
                    name="recipientId"
                    label="User Id"
                    fullWidth
                    value={senderId}
                    autoComplete="off"
                    helperText="Please enter User ID."
                    onChange={(evt) => setSenderId(evt.target.value)}
                />
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
                    onClick={importFromUser}
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