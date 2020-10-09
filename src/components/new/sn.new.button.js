import React from "react";
import SaveIcon from "@material-ui/icons/Save";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import DeleteIcon from "@material-ui/icons/Delete";
import { DELETE } from "../../sn.constants";
import { Button } from "@material-ui/core";

const SnNewButton = (props) => {
  return (
    <React.Fragment>
      {!props.isRegister && props.isAppOwner && (
        <Button
          variant="contained"
          className="btn-register-pg"
          color="secondary"
          type="button"
          onClick={(evt) => props.onDelete(evt, DELETE)}
          id="btnDelete"
          startIcon={<DeleteIcon />}
        >
          Delete Skylink
        </Button>
      )}
      {(props.isRegister || props.edit || true) && props.isAppOwner && (
        <Button
          variant="contained"
          color="primary"
          className="btn-register-pg btn-bg-color"
          type="submit"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      )}
      {!props.isRegister && (
        <Button
          variant="contained"
          color="primary"
          className="btn-register-pg btn-bg-color"
          onClick={(evt) => props.onDone(evt)}
          type="button"
          startIcon={<CheckCircleRoundedIcon />}
        >
          Done
        </Button>
      )}
    </React.Fragment>
  );
};

export default SnNewButton;
