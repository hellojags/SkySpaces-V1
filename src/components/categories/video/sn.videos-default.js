import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { launchSkyLink } from "../../../sn.util";
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import SnAppCardActionBtnGrp from "../../cards/sn.app-card-action-btn-grp";
import { makeStyles } from "@material-ui/core/styles";
import { setLoaderDisplay } from "../../../reducers/actions/sn.loader.action";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import { fetchSkyspaceAppCount } from "../../../reducers/actions/sn.skyspace-app-count.action";
import CardHeader from "@material-ui/core/CardHeader";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined";
import GamesOutlinedIcon from "@material-ui/icons/GamesOutlined";
import PlaylistAddOutlinedIcon from "@material-ui/icons/PlaylistAddOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined"; import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import ReactImageVideoLightbox from "react-image-video-lightbox";
import cliTruncate from "cli-truncate";
import SnAddToSkyspaceModal from "../../modals/sn.add-to-skyspace.modal";
import { skylinkToUrl } from "../../../sn.util";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import { DOWNLOAD } from "../../../sn.constants";
import {
  bsGetSkyspaceNamesforSkhubId,
  bsAddSkylinkFromSkyspaceList,
  bsRemoveFromSkySpaceList,
  bsRemoveSkylinkFromSkyspaceList,
  bsAddToHistory
} from "../../../blockstack/blockstack-api";
import { useSelector, useDispatch } from "react-redux";

import { toggleTopbarDisplay } from "../../../reducers/actions/sn.topbar-display.action";
import { toggleDesktopMenuDisplay } from "../../../reducers/actions/sn.desktop-menu.action";
import { Button, Paper } from "@material-ui/core";
import useStyles from "./sn.video.styles";


export default function SnVideosDefault(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [showAddToSkyspace, setShowAddToSkyspace] = useState(false);
  const [availableSkyspaces, setAvailableSkyspaces] = useState([]);
  const [currentApp, setCurrentApp] = useState();
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoPlayerData, setVideoPlayerData] = useState([]);
  const [imageStatus, setImageStatus] = React.useState(false);
  const [selectedImagesLength, setSelectedImagesLength] = React.useState([]);

  const stUserSession = useSelector((state) => state.userSession);
  const stSnSkyspaceList = useSelector((state) => state.snSkyspaceList);

  const download = (app) => {
    dispatch(setLoaderDisplay(true));
    bsAddToHistory(stUserSession, {
      skylink: app.skylink,
      fileName: app.name,
      action: DOWNLOAD,
      contentLength: "",
      contentType: "",
      skhubId: app.skhubId,
      skyspaces: [],
      savedToSkySpaces: false,
    }).then(() => {
      dispatch(setLoaderDisplay(false));
      launchSkyLink(app.skylink, stUserSession);
    });
  };

  const launchVideo = (app, index) => {
    dispatch(toggleDesktopMenuDisplay());
    setVideoPlayerData([{
      url: skylinkToUrl(app.skylink),
      type: "video",
      altTag: app.name
    }]);
    dispatch(toggleTopbarDisplay());
    setShowVideoPlayer(true);
  };

  const onVideoPlayerClose = (evt) => {
    setShowVideoPlayer(false);
    setVideoPlayerData([]);
    dispatch(toggleDesktopMenuDisplay());
    dispatch(toggleTopbarDisplay());
  }

  const handleSkyspaceAdd = (app) => {
    const skhubId = app.skhubId;
    bsGetSkyspaceNamesforSkhubId(stUserSession, skhubId)
      .then((skyspacesForApp) => {
        console.log("skyspacesForApp ", skyspacesForApp);
        if (skyspacesForApp == null) {
          skyspacesForApp = [];
        } else {
          skyspacesForApp = skyspacesForApp.skyspaceForSkhubIdList;
        }
        return stSnSkyspaceList.filter(
          (skyspace) => !skyspacesForApp.includes(skyspace)
        );
      })
      .then((availableSkyspaces) => {
        console.log("availableSkyspaces", availableSkyspaces);
        if (availableSkyspaces != null && availableSkyspaces.length > 0) {
          console.log("will show add to skyspace modal");
          setCurrentApp(app);
          setShowAddToSkyspace(true);
          setAvailableSkyspaces(availableSkyspaces);
        } else {
          console.log("NO new skyspace available");
        }
      });
  };

  const saveAddToSkyspaceChanges = (skyspaceList) => {
    const app = currentApp;
    if (skyspaceList != null && skyspaceList.lenghth !== 0) {
      dispatch(setLoaderDisplay(true));
      bsAddSkylinkFromSkyspaceList(
        stUserSession,
        app.skhubId,
        skyspaceList
      ).then(() => {
        dispatch(setLoaderDisplay(false));
        setShowAddToSkyspace(false);
        setCurrentApp();
        dispatch(fetchSkyspaceAppCount());
      });
    }
  };

  const removeFromSkyspace = (app) => {
    const skhubId = app.skhubId;
    dispatch(setLoaderDisplay(true));
    if (typeof props.skyspace != "undefined" && props.skyspace) {
      bsRemoveFromSkySpaceList(stUserSession, props.skyspace, skhubId).then(
        (res) => {
          dispatch(fetchSkyspaceAppCount());
          dispatch(setLoaderDisplay(false));
          props.onDelete();
        }
      );
    } else {
      bsRemoveSkylinkFromSkyspaceList(
        stUserSession,
        skhubId,
        app.skyspaceList
      ).then((res) => {
        dispatch(setLoaderDisplay(false));
        props.onDelete();
      });
    }
  };

  const imageClick = (app, idx) => {
    if (props.isSelect) {
      if (props.arrSelectedAps.indexOf(app) === -1) {
        props.onSelection(app);
      } else {
        props.onSelection(app, true);
      }
    } else {
      launchVideo(app, idx);
    }
  };

  return (
    <>
      <Grid
        container
        spacing={3}
        className={` most_main_grid_gallery ${classes.most_main_grid_gallery}`}
      >
        <Grid
          item
          xs={12}
          className={classes.main_grid_gallery}
          style={{ paddingTop: "0px" }}
        >
          <Paper className={`${classes.paper} ${classes.MaintabsPaper_gallery}`}>
            <Paper className={classes.tabsPaper_gallery}>
              {/* title bar when an image is selected */}
              {imageStatus ? (
                <Grid container spacing={3} style={{ margin: "0px" }}>
                  <Grid
                    item
                    xs={12}
                    className={classes.titleBar_onSelect_img_grid_gallery}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <Button
                          variant="contained"
                          color="secondary"
                          className={classes.button}
                          startIcon={<DoneAllIcon style={{ color: "#1ed660" }} />}
                          size="small"
                          style={{
                            background: "transparent",
                            color: "#636f70",
                            boxShadow: "none",
                          }}
                        >
                          Select all
                    </Button>

                        <Button
                          variant="contained"
                          color="secondary"
                          className={classes.button}
                          startIcon={
                            <DeleteOutlineIcon style={{ color: "#ff3d3d" }} />
                          }
                          size="small"
                          style={{
                            background: "transparent",
                            color: "#636f70",
                            boxShadow: "none",
                            marginLeft: "15px",
                          }}
                        >
                          Delete
                    </Button>

                        <Button
                          variant="contained"
                          color="secondary"
                          className={classes.button}
                          startIcon={
                            <ShareOutlinedIcon style={{ color: "#1ed660" }} />
                          }
                          size="small"
                          style={{
                            background: "transparent",
                            color: "#636f70",
                            boxShadow: "none",
                            marginLeft: "15px",
                          }}
                        >
                          Share
                    </Button>

                        <Button
                          variant="contained"
                          color="secondary"
                          className={classes.button}
                          startIcon={
                            <GamesOutlinedIcon style={{ color: "#1ed660" }} />
                          }
                          size="small"
                          style={{
                            background: "transparent",
                            color: "#636f70",
                            boxShadow: "none",
                            marginLeft: "15px",
                          }}
                        >
                          Move to
                    </Button>

                        <Button
                          variant="contained"
                          color="secondary"
                          className={classes.button}
                          startIcon={
                            <PlaylistAddOutlinedIcon
                              style={{ color: "#1ed660" }}
                            />
                          }
                          size="small"
                          style={{
                            background: "transparent",
                            color: "#636f70",
                            boxShadow: "none",
                            marginLeft: "15px",
                          }}
                        >
                          Add to
                    </Button>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        {selectedImagesLength.length} Selected
                    <ClearOutlinedIcon
                          onClick={() => {
                            setImageStatus(!imageStatus);
                            props.handleUploadSection(!imageStatus);
                            setSelectedImagesLength([]);
                          }}
                          style={{
                            color: "#1ed660",
                            fontSize: "18px",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              ) : null}

              {/* dropzone */}
              <Grid container spacing={3} style={{ margin: "0px" }}>
                {props.filteredApps &&
                  props.filteredApps
                    .slice(
                      (props.page - 1) * props.itemsPerPage,
                      (props.page - 1) * props.itemsPerPage + props.itemsPerPage
                    )
                    .map((app, i) => (
                      <Grid
                        item
                        lg={3}
                        md={4}
                        sm={6}
                        xs={12}
                        className={`image_grid_gallery ${classes.image_grid_gallery}`}
                      >
                        <div
                          className={`inner_image_icons ${classes.inner_image_icons}`}
                        >
                          {props.isSelect && (
                            <>
                              {props.arrSelectedAps.indexOf(app) === -1 && (
                                <RadioButtonUncheckedIcon className="selection-radio"
                                  onClick={() => props.onSelection(app)} />
                              )}
                              {props.arrSelectedAps.indexOf(app) > -1 && (
                                <RadioButtonCheckedIcon className="selection-radio"
                                  onClick={() => props.onSelection(app, true)} />
                              )}
                            </>
                          )}
                          {!props.isSelect && <SnAppCardActionBtnGrp
                            app={app}
                            hash={props.hash}
                            source="img"
                            hideTags={true}
                            hideDelete={props.senderId != null}
                            hideAdd={props.senderId != null}
                            onAdd={() => handleSkyspaceAdd(app)}
                            onEdit={() => props.openSkyApp(app)}
                            onDelete={() => removeFromSkyspace(app)}
                            onDownload={() => download(app)}
                          />
                          }
                        </div>
                        <img
                          alt={app.title}
                          src={skylinkToUrl(app.thumbnail)}
                          style={{
                            width: "100%",
                            height: "250px",
                            border: props.arrSelectedAps.indexOf(app) > -1 ? "2px solid #1ed660" : null,
                          }}
                          onClick={() => imageClick(app, i)}
                          name="1"
                        />
                      </Grid>

                    ))
                }
              </Grid>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
      {showVideoPlayer && (<div className="lightbox-container">
        <ReactImageVideoLightbox
          id="light-box"
          className="light-box"
          data={videoPlayerData}
          startIndex={0}
          onCloseCallback={onVideoPlayerClose}
        />
      </div>)}


      <SnAddToSkyspaceModal
        userSession={stUserSession}
        open={showAddToSkyspace}
        availableSkyspaces={availableSkyspaces}
        onClose={() => setShowAddToSkyspace(false)}
        onSave={saveAddToSkyspaceChanges}
      />
    </>
  );

  return (
    <>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          {props.filteredApps &&
            props.filteredApps
              .slice(
                (props.page - 1) * props.itemsPerPage,
                (props.page - 1) * props.itemsPerPage + props.itemsPerPage
              )
              .map((app, i) => {
                return (
                  <>
                    <Grid item sm={4} xs={12} key={i}>
                      <Card className={classes.root}>
                        <CardHeader
                          className={classes.cardHeader}
                          /* avatar={
                          <Avatar
                            aria-label="recipe"
                            className={classes.avatar}
                          >
                            R
                          </Avatar>
                        } */
                          /* action={
                            <IconButton aria-label="settings">
                              <MoreVertIcon />
                            </IconButton>
                          } */
                          title={
                            <div>
                              <div>
                                <Link
                                  variant="inherit"
                                  className="font-weight-bold cursor-pointer h5"
                                  color="black"
                                  onClick={() => {
                                    download(app);
                                  }}
                                >
                                  {cliTruncate(app.name, 25)}
                                </Link>
                                {props.isSelect && (
                                  <>
                                    {props.arrSelectedAps.indexOf(app) === -1 && (
                                      <RadioButtonUncheckedIcon className="selection-radio"
                                        onClick={() => props.onSelection(app)} />
                                    )}
                                    {props.arrSelectedAps.indexOf(app) > -1 && (
                                      <RadioButtonCheckedIcon className="selection-radio"
                                        onClick={() => props.onSelection(app, true)} />
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          }
                        />
                        <CardMedia
                          component="img"
                          onLoad={() => console.log("image loaded")}
                          height="100"
                          className={(classes.media, "cursor-pointer card-media")}
                          src={skylinkToUrl(app.thumbnail)}
                          onClick={() => launchVideo(app, i)}
                          title={app.name}
                        />
                        <CardContent
                          style={{
                            paddingBottom: 0,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            {cliTruncate(app.description, 40)}
                          </Typography>
                        </CardContent>
                        <CardActions disableSpacing
                          className="vertical-padding-0">
                          <SnAppCardActionBtnGrp
                            app={app}
                            // hideDelete={
                            //   this.props.skyspace == null ||
                            //   this.props.skyspace.trim() === ""
                            // }
                            source="img"
                            hash={props.hash}
                            hideTags={true}
                            hideDelete={props.senderId != null}
                            hideAdd={props.senderId != null}
                            onAdd={() => handleSkyspaceAdd(app)}
                            onEdit={() => props.openSkyApp(app)}
                            onDelete={() => removeFromSkyspace(app)}
                            onDownload={() => download(app)}
                          />
                        </CardActions>
                      </Card>
                    </Grid>
                  </>
                );
              })}
        </Grid>
      </Grid>

      {showVideoPlayer && (<div className="lightbox-container">
        <ReactImageVideoLightbox
          id="light-box"
          className="light-box"
          data={videoPlayerData}
          startIndex={0}
          onCloseCallback={onVideoPlayerClose}
        />
      </div>)}


      <SnAddToSkyspaceModal
        userSession={stUserSession}
        open={showAddToSkyspace}
        availableSkyspaces={availableSkyspaces}
        onClose={() => setShowAddToSkyspace(false)}
        onSave={saveAddToSkyspaceChanges}
      />
      {/* <SnInfoModal
          open={this.state.snInfoModal.open}
          onClose={this.state.snInfoModal.onClose}
          title={this.state.snInfoModal.title}
          content={this.state.snInfoModal.description}
        /> */}

      {/* <Snackbar
          open={this.state.openCopySuccess}
          autoHideDuration={3000}
          onClose={this.closeCopySucess}
        >
          <Alert onClose={this.closeCopySucess} severity="success">
            Skylink successfully copied to clipboard!
          </Alert>
        </Snackbar> */}
    </>
  );
}
