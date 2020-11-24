import React from "react";
import SaveIcon from "@material-ui/icons/Save";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import DeleteIcon from "@material-ui/icons/Delete";
import { DELETE } from "../../sn.constants";
import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./sn.new.styles";

const useStyles = makeStyles(styles);

const SnNewButton = (props) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        {!props.isRegister && props.isAppOwner && (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            type="button"
            onClick={(evt) => props.onDelete(evt, DELETE)}
            id="btnDelete"
            startIcon={<DeleteIcon />}
            className={classes.ef_delbtn}
          >
            Delete
          </Button>


        )}
        {(props.isRegister || props.edit || true) && props.isAppOwner && (

          <Button
            variant="contained"
            color="primary"
            size="small"
            type="submit"
            className={`${classes.button}  ${classes.ef_saveBtn}`}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        )}
        {!props.isRegister && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={`${classes.button}  ${classes.ef_doneBtn}`}
            startIcon={<CheckCircleIcon />}
            onClick={(evt) => props.onDone(evt)}
            type="button"
          >
            Done
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default SnNewButton;
