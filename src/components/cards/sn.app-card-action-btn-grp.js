import React from "react";
import CardActions from "@material-ui/core/CardActions";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import clsx from "clsx";
import useStyles from "./sn.app-card.styles";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { APP_BG_COLOR } from "../../sn.constants";
import { Typography } from "@material-ui/core";

class SnAppCardActionBtnGrp extends React.Component {
  render() {
    const { app, classes, source } = this.props;
    return (
      <>
        <div
          style={{
            //   marginTop: 8,
            // marginBottom: 10,
            display: "flex",
            flexDirection: "row",
          }}
        >
          {(this.props.hideTags == null || !this.props.hideTags) && app.tags?.length > 0 && (
            <>
              <div style={{ paddingLeft: 62 }}>
                <Typography variant="span" className={classes.status}>
                  Tags
                  </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {app.tags.map((tag, idx) => (
                    <Typography variant="span" className={classes.tagsBg} key={idx}>
                      {tag}
                    </Typography>
                  ))}
                </div>
              </div>
            </>
          )}

          {this.props.hash == null && <div style={{ marginLeft: "auto" }}>
            {(this.props.hideAdd == null || this.props.hideAdd === false) && (
              <Tooltip title="Add to other Spaces" arrow>
                <IconButton
                  onClick={this.props.onAdd}
                >
                  <AddCircleOutlineOutlinedIcon className={classes.tagEditIcon} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Edit Skylink" arrow>
              <IconButton
                onClick={this.props.onEdit}
              >
                <EditOutlinedIcon className={classes.tagEditIcon} />
              </IconButton>
            </Tooltip>
            {this.props.hideDelete === false && (
              <Tooltip title="Remove from this Space" arrow>
                <IconButton onClick={this.props.onDelete} color="secondary">
                  <DeleteOutlineIcon className={classes.tagEditIcon} />
                </IconButton>
              </Tooltip>
            )}




          </div>}
        </div>
        {/* <div
          className={clsx({
            "card-btn-container": true,
            "margin-auto": source === "img",
          })}
        >
          {(this.props.hideTags == null || !this.props.hideTags) && app.tags?.length > 0 && (
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
          {this.props.hash == null && (


            <CardActions
              disableSpacing
              className={clsx({
                "full-width": true,
                "no-padding-b": source !== "img",
                "vertical-padding-0": source === "img",
              })}
            >
              <div className="margin-l-auto">
                {(this.props.hideAdd == null || this.props.hideAdd === false) && (
                  <Tooltip title="Add to other Spaces" arrow>
                    <IconButton
                      onClick={this.props.onAdd}
                      style={{ color: APP_BG_COLOR }}
                    >
                      <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Edit Skylink" arrow>
                  <IconButton
                    onClick={this.props.onEdit}
                    style={{ color: APP_BG_COLOR }}
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                </Tooltip>
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
        </div> */}
      </>
    );
  }
}

export default withStyles(useStyles)(SnAppCardActionBtnGrp);
