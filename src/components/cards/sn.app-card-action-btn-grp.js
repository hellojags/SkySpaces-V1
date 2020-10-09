import React from "react";
import CardActions from "@material-ui/core/CardActions";
import clsx from "clsx";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { APP_BG_COLOR } from "../../sn.constants";

const useStyles = (theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  avatar: {
    backgroundColor: green[500],
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "0px",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
});

class SnAppCardActionBtnGrp extends React.Component {
  render() {
    const { app } = this.props;
    const source = this.props.source;
    return (
      <div
        className={clsx({
          "card-btn-container": true,
          "margin-auto": source === "img",
        })}
      >
        {(this.props.hideTags == null || !this.props.hideTags) && app.tags?.length>0 &&(
          <div className="card-tag-parent">
            <div className="card-tag-container pl-20">
              <span className="pr-2 pl-2">
                <b>Tags:</b>
              </span>{" "}
              {app.tags.map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  variant="outlined"
                  size="small"
                ></Chip>
              ))}
            </div>
          </div>
        )}
        {this.props.hash==null && (

        
        <CardActions
          disableSpacing
          className={clsx({
            "full-width": true,
            "no-padding-b": source !== "img",
            "vertical-padding-0": source === "img",
          })}
        >
          <div className="margin-l-auto">
            <Tooltip title="Add to other Spaces" arrow>
              <IconButton
                onClick={this.props.onAdd}
                style={{ color: APP_BG_COLOR }}
              >
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Skylink" arrow>
              <IconButton
                onClick={this.props.onEdit}
                style={{ color: APP_BG_COLOR }}
              >
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Info" arrow>
              <IconButton onClick={this.props.onInfo}>
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
            {app.skylink && app.skylink.trim() !== "" && (
              <Tooltip title="Launch Skylink" arrow>
                <IconButton onClick={this.props.onLaunch}>
                  <OpenInNewIcon />
                </IconButton>
              </Tooltip>
            )} */}
            {/* <Tooltip title="Download" arrow>
              <IconButton onClick={this.props.onDownload}>
                <GetAppOutlinedIcon />
              </IconButton>
            </Tooltip> */}
            {this.props.hideDelete === false && (
              <Tooltip title="Remove from this Space" arrow>
                <IconButton onClick={this.props.onDelete} color="secondary">
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </CardActions>
        )}
      </div>
    );
  }
}

export default withStyles(useStyles)(SnAppCardActionBtnGrp);
