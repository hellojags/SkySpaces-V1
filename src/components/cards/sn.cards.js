import React from "react";
import { Redirect } from "react-router-dom";
import useStyles from "./sn.cards.styles";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import Grid from "@material-ui/core/Grid";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import AppsIcon from "@material-ui/icons/Apps";
import ReorderIcon from "@material-ui/icons/Reorder";
import MenuItem from "@material-ui/core/MenuItem";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import InputBase from "@material-ui/core/InputBase";
import LowPriorityIcon from "@material-ui/icons/LowPriority";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PublishIcon from "@material-ui/icons/Publish";
import HeadsetIcon from "@material-ui/icons/Headset";
import { INITIAL_PORTALS_OBJ } from "../../blockstack/constants";
import SnUpload from "../new/sn.upload";
import { v4 as uuidv4 } from 'uuid';
import { SkynetClient, parseSkylink } from "skynet-js";
import { getEmptyHistoryObject, getEmptySkylinkObject } from "../new/sn.new.constants";
import BlockIcon from '@material-ui/icons/Block';
import { Button, FormControlLabel, Switch, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Avatar from '@material-ui/core/Avatar';
import Tooltip from "@material-ui/core/Tooltip";
import { green } from "@material-ui/core/colors";
import { subtractSkapps, getPortalFromUserSetting, setTypeFromFile, getAllPublicApps } from "../../sn.util";
import SnInfoModal from "../modals/sn.info.modal";
import SnAppCard from "./sn.app-card";
import {
  ITEMS_PER_PAGE,
  getCompatibleTags,
  APP_BG_COLOR,
  DEFAULT_PORTAL,
  PUBLIC_SHARE_BASE_URL,
  PUBLIC_SHARE_ROUTE,
  PUBLIC_SHARE_APP_HASH, PUBLIC_TO_ACC_QUERY_PARAM, SKYSPACE_HOSTNAME
} from "../../sn.constants";
import {
  CATEGORY_OBJ,
  getCategoryObjWithoutAll,
} from "../../sn.category-constants";
import { connect } from "react-redux";
import { mapStateToProps, matchDispatcherToProps } from "./sn.cards.container";
import { bsGetSkyspaceNamesforSkhubId, bsGetAllSkyspaceObj, bsAddToHistory, bsGetSharedSpaceAppList } from "../../blockstack/blockstack-api";
import SnPagination from "../tools/sn.pagination";
import { INITIAL_SETTINGS_OBJ } from "../../blockstack/constants";
import Chip from '@material-ui/core/Chip';
import UploadProgress from "../upload/UploadProgress/UploadProgress";
import { getPublicApps, getSkylinkPublicShareFile, savePublicSpace } from "../../skynet/sn.api.skynet";
import AudioPlayer from "../categories/audio/sn.audio-player";


const BootstrapInput = withStyles((theme) => ({
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "white",
    color: theme.palette.linksColor,
    //   border: '1px solid #ced4da',
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    //   transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    "&:focus": {
      // borderRadius: 4,
      // borderColor: '#80bdff',
      backgroundColor: "white",
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);


class SnCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goToApp: false,
      senderId: null,
      loadingAllSpacesInfo: true,
      showAddToSkyspace: false,
      skyappId: "",
      apps: [],
      allSpacesObj: null,
      error: null,
      fetchAllSkylinks: false,
      category: null,
      skyspace: null,
      searchKey: "",
      filteredApps: [],
      tagFilterList: [],
      filterCriteria: {
        searchString: "",
        page: 1,
        tagFilterList: [],
        switchFilterList: [],
      },
      isSelect: false,
      arrSelectedAps: [],
      hash: null,
      showInfoModal: false,
      infoModalContent: null,
      isDir: false,



      //new UI START
      activeStep: 0,
      filterSelection: "emp",
      isTrue: false,
      GridUi: true

      //new UI END

    };
    this.openSkyApp = this.openSkyApp.bind(this);
    this.handleSrchSbmt = this.handleSrchSbmt.bind(this);
    this.handleSrchKeyChng = this.handleSrchKeyChng.bind(this);
    this.getFilteredApps = this.getFilteredApps.bind(this);
    this.uploadEleRef = React.createRef();
  }

  //new ui start
  setActiveStep = (activeStep) => this.setState({ activeStep });
  setFilterSelection = (filterSelection) => this.setState({ filterSelection });
  setGridUi = (GridUi) => this.setState({ GridUi });
  handleUploadSection = (value) => {
    this.setIsTrue(value);
  };
  handleChange = (event) => {
    this.setFilterSelection(event.target.value);
  };

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return {/* <AllSpaces /> */ };
      case 1:
        return {/* <ImagesGallery handleUploadSection={handleUploadSection} /> */ };
      case 2:
        return {/* <AudioSpaces /> */ };
      case 3:
        return {/* <EditFile /> */ };
      default:
        return "unknown step";
    }
  }
  getStepContentForList = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return {/* <AllSpacesListView /> */ };
      case 1:
        return {/* <ImagesGallery handleUploadSection={handleUploadSection} /> */ };
      case 2:
        return {/* <AudioSpacesListView /> */ };
      case 3:
        return {/* <EditFile /> */ };
      default:
        return "unknown step";
    }
  }
  //new ui end

  updateSwitches = (switchFilterList) => {
    const { filterCriteria } = this.state;
    filterCriteria.switchFilterList = switchFilterList;
    this.setState({ filterCriteria });
  };

  updateTagFilterList = (tagFilterList) => {
    const { filterCriteria } = this.state;
    filterCriteria.tagFilterList = tagFilterList;
    filterCriteria.page = 1;
    this.setState({ filterCriteria });
  };

  udpdatePage = (page) => {
    const { filterCriteria } = this.state;
    filterCriteria.page = page;
    this.setState({ filterCriteria });
  };

  handleSrchSbmt(evt) {
    evt.preventDefault();
  }

  handleSrchKeyChng(evt, val) {
    evt != null && evt.preventDefault();
    const { filterCriteria } = this.state;
    filterCriteria.page = 1;
    this.setState({
      searchKey: evt != null ? evt.target.value : val,
      filterCriteria,
    });
  }

  searchFilter(skyApp, searchKey) {
    if (searchKey && searchKey.trim() !== "") {
      for (const skyAppKey in skyApp) {
        if (
          skyApp[skyAppKey] &&
          skyApp[skyAppKey].toLowerCase().equals(searchKey.toLowerCase())
        ) {
          return skyApp;
        }
      }
    } else {
      return skyApp;
    }
  }

  openSkyApp(skapp) {
    const category = this.state.category;
    const skyspace = this.state.skyspace;
    let skyappId = "";
    if (category != null && category.trim() !== "") {
      skyappId = skapp.id;
    } else if (
      (skyspace != null && skyspace.trim() !== "") ||
      this.state.fetchAllSkylinks
    ) {
      skyappId = skapp.skhubId;
    }
    this.setState({
      goToApp: true,
      skyappId: encodeURIComponent(skyappId),
    });
  }

  getSearchKeyFromQuery = () => {
    const pathSrch = this.props.location.search;
    return decodeURIComponent(pathSrch.replace("?query=", ""));
  };

  getCategoryWiseCount = () => {
    const categoryCountObj = {};
    this.props.snApps.forEach((app) => {
      categoryCountObj[app.type] = categoryCountObj[app.type]
        ? categoryCountObj[app.type] + 1
        : 1;
    });
    return categoryCountObj;
  };

  async getAppList(category, skyspace, fetchAllSkylinks, hash) {
    const senderId = this.getSenderId();
    category != null && this.props.fetchApps(category);
    if (skyspace != null) {
      if (senderId != null) {
        this.props.setLoaderDisplay(true);
        const appListFromSharedSpace = await bsGetSharedSpaceAppList(this.props.userSession, decodeURIComponent(senderId), skyspace);
        this.props.setLoaderDisplay(false);
        this.props.setApps(appListFromSharedSpace);
      } else {
        this.props.fetchSkyspaceApps({
          session: this.props.userSession,
          skyspace: skyspace,
        });
      }
    }
    if (hash != null) {
      this.props.setDesktopMenuState(false);
      this.props.setPortalsListAction(INITIAL_PORTALS_OBJ);
      this.props.fetchPublicApps(hash);
    }

    if (fetchAllSkylinks === true) {
      this.handleSrchKeyChng(null, this.getSearchKeyFromQuery());
      this.props.fetchAllSkylinks({
        session: this.props.userSession,
      });
    } else {
      this.handleSrchKeyChng(null, "");
    }
  }

  getSenderId() {
    if (this.props.location.pathname.indexOf("imported-spaces") > -1) {
      return this.props.match.params.sender;
    }
  }

  componentDidMount() {
    const skyspace = this.props.match.params.skyspace;
    const category = this.props.match.params.category;
    const senderId = this.getSenderId();
    const queryHash = this.props.location.search.indexOf("?sialink=") > -1 ? this.props.location.search.replace("?sialink=", "").trim() : "";
    const hash = queryHash === "" ? null : queryHash;
    hash && this.props.setPublicHash(hash);
    const fetchAllSkylinks = this.props.match.path === "/skylinks";
    this.setState({
      skyspace,
      category,
      fetchAllSkylinks: fetchAllSkylinks,
      page: 1,
      hash,
      senderId
    });
    this.props.fetchSkyspaceDetail();
    this.getAppList(category, skyspace, fetchAllSkylinks, hash, senderId);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const skyspace = this.props.match.params.skyspace;
    const category = this.props.match.params.category;
    const senderId = this.getSenderId();
    const queryHash = this.props.location.search.indexOf("?sialink=") > -1 ? this.props.location.search.replace("?sialink=", "").trim() : "";
    const hash = queryHash === "" ? null : queryHash;
    const fetchAllSkylinks = this.props.match.path === "/skylinks";
    if (
      this.state.category !== category ||
      this.state.hash !== hash ||
      this.state.skyspace !== skyspace ||
      this.state.fetchAllSkylinks !== fetchAllSkylinks ||
      this.state.senderId !== senderId ||
      (fetchAllSkylinks &&
        this.getSearchKeyFromQuery() !== this.state.searchKey)
    ) {
      this.props.fetchSkyspaceDetail();
      this.updateTagFilterList([]);
      this.setState({
        skyspace,
        hash,
        fetchAllSkylinks: fetchAllSkylinks,
        category,
        page: 1,
        senderId
      });
      hash && this.props.setPublicHash(hash);
      this.getAppList(category, skyspace, fetchAllSkylinks, hash, senderId);
    }
  }

  tagFilter = (app) => {
    if (this.state.filterCriteria.tagFilterList.length !== 0) {
      const appTagList = getCompatibleTags(app.type);
      return (
        appTagList.filter(
          (appTag) =>
            this.state.filterCriteria.tagFilterList.indexOf(appTag) > -1
        ).length > 0
      );
    } else {
      return true;
    }
  };

  getFilteredApps() {
    const searchKey = this.state.searchKey;
    const filteredApps = this.props.snApps
      .filter(this.tagFilter)
      .filter((app) => {
        if (searchKey && searchKey.trim() !== "") {
          for (const skyAppKey in app) {
            if (
              app.hasOwnProperty(skyAppKey) &&
              skyAppKey !== "category" &&
              app[skyAppKey] != null &&
              app[skyAppKey]
                .toString()
                .toLowerCase()
                .indexOf(searchKey.toLowerCase()) > -1
            ) {
              return app;
            }
          }
        } else {
          return app;
        }
        return "";
      });
    return filteredApps;
  }

  handleSkyspaceAdd = (app) => {
    const skhubId = app.skhubId;
    bsGetSkyspaceNamesforSkhubId(this.props.userSession, skhubId)
      .then((skyspacesForApp) => {
        console.log("skyspacesForApp ", skyspacesForApp);
        if (skyspacesForApp == null) {
          skyspacesForApp = [];
        }
        return this.props.snSkyspaceList.filter(
          (skyspace) => !skyspacesForApp.includes(skyspace)
        );
      })
      .then((availableSkyspaces) => {
        console.log("availableSkyspaces", availableSkyspaces);
        if (availableSkyspaces != null && availableSkyspaces.length > 0) {
          this.setState({
            showAddToSkyspace: true,
            availableSkyspaces,
          });
        } else {
          console.log("NO new skyspace available");
        }
      });
  };

  selectApp = (app, isDeselection) => {
    const arrSelectedAps = this.state.arrSelectedAps;
    if (isDeselection) {
      const idx = arrSelectedAps.indexOf(app);
      idx > -1 && arrSelectedAps.splice(idx, 1);
    } else {
      arrSelectedAps.push(app);
    }
    this.setState({ arrSelectedAps });
  }

  renderCards = (filteredApps, page, cardCount, skyspace) => {
    const filterList = this.state.filterCriteria.tagFilterList;
    let filterCriteria = "";
    if (filterList != null && filterList.length > 0) {
      filterCriteria = filterList[0];
    }

    if (
      CATEGORY_OBJ[filterCriteria] != null &&
      CATEGORY_OBJ[filterCriteria]["cards"] != null
    ) {
      return CATEGORY_OBJ[filterCriteria]["cards"](
        page,
        filteredApps,
        skyspace,
        ITEMS_PER_PAGE,
        this.openSkyApp,
        (app, isDeselection) => this.selectApp(app, isDeselection),
        this.state.isSelect,
        this.state.arrSelectedAps,
        this.state.hash,
        () =>
          this.getAppList(
            this.state.category,
            this.state.skyspace,
            this.state.fetchAllSkylinks
          ),
        this.state.senderId
      );
    } else {
      return (
        <Grid container spacing={3} style={{ width: "100%", margin: "auto" }}>
          {filteredApps
            .slice(
              (page - 1) * ITEMS_PER_PAGE,
              (page - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
            )
            .map((app, i) => {
              cardCount = cardCount + 1;
              return (
                <SnAppCard
                  key={i}
                  app={app}
                  hash={this.state.hash}
                  isSelect={this.state.isSelect}
                  arrSelectedAps={this.state.arrSelectedAps}
                  skyspace={skyspace}
                  senderId={this.state.senderId}
                  allSpacesObj={this.props.snSkyspaceDetail}
                  cardCount={filteredApps.length}
                  onSelection={(app, isDeselection) => this.selectApp(app, isDeselection)}
                  onOpenSkyApp={this.openSkyApp}
                  onDelete={() => {
                    this.props.fetchSkyspaceDetail();
                    this.getAppList(
                      this.state.category,
                      this.state.skyspace,
                      this.state.fetchAllSkylinks
                    );
                  }
                  }
                />
              );
            })
          }
        </Grid>
      );


      return (
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {filteredApps
              .slice(
                (page - 1) * ITEMS_PER_PAGE,
                (page - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
              )
              .map((app, i) => {
                cardCount = cardCount + 1;
                return (
                  <SnAppCard
                    key={i}
                    app={app}
                    hash={this.state.hash}
                    isSelect={this.state.isSelect}
                    arrSelectedAps={this.state.arrSelectedAps}
                    skyspace={skyspace}
                    senderId={this.state.senderId}
                    allSpacesObj={this.props.snSkyspaceDetail}
                    cardCount={filteredApps.length}
                    onSelection={(app, isDeselection) => this.selectApp(app, isDeselection)}
                    onOpenSkyApp={this.openSkyApp}
                    onDelete={() => {
                      this.props.fetchSkyspaceDetail();
                      this.getAppList(
                        this.state.category,
                        this.state.skyspace,
                        this.state.fetchAllSkylinks
                      );
                    }
                    }
                  />
                );
              })}
          </Grid>
        </Grid>
      );
    }
  };

  createSkylinkPublicShare = async () => {
    if (this.state.arrSelectedAps.length !== 0) {

      this.props.setLoaderDisplay(true);
      const skylinkListFile = getSkylinkPublicShareFile({
        data: this.state.arrSelectedAps,
        history: [{
          creationDate: new Date()
        }]
      });
      const portal = this.props.snUserSetting?.setting?.portal || DEFAULT_PORTAL;
      let uploadedContent = await new SkynetClient(portal).uploadFile(skylinkListFile);
      if (uploadedContent) {
        uploadedContent = {
          skylink: parseSkylink(uploadedContent)
        };
      }
      let historyObj = getEmptyHistoryObject();
      historyObj.fileName = "Public Share";
      historyObj.skylink = uploadedContent.skylink;
      historyObj.action = "Public Share";
      bsAddToHistory(this.props.userSession, historyObj);
      this.setState({
        showInfoModal: true,
        onInfoModalClose: () => this.setState({ showInfoModal: false }),
        infoModalContent: `${this.props.snUserSetting.setting.portal}${PUBLIC_SHARE_APP_HASH}/#/${PUBLIC_SHARE_ROUTE}?sialink=${uploadedContent.skylink}`
      })
      this.props.setLoaderDisplay(false);
    }
  }

  deleteFromPublic = (evt) => {
    evt.preventDefault();
    if (this.state.isSelect && this.state.arrSelectedAps.length > 0) {
      console.log("public apps to delete ", this.state.arrSelectedAps);
      const inMemObj = this.props.snPublicInMemory;
      inMemObj.deletedSkapps = [...new Set([...inMemObj.deletedSkapps, ...this.state.arrSelectedAps])];
      this.props.setApps(getAllPublicApps(this.props.snApps, inMemObj.addedSkapps, inMemObj.deletedSkapps));
    }
  }


  onPublicUpload = (uploadObj) => {
    const app = { ...getEmptySkylinkObject(), ...uploadObj };
    setTypeFromFile(app.contentType, app)
    app.skhubId = uuidv4();
    console.log(" upload complete ", app);
    const inMemObj = this.props.snPublicInMemory;
    inMemObj.addedSkapps = [...new Set([app, ...inMemObj.addedSkapps])];
    this.props.setApps(getAllPublicApps(this.props.snApps, inMemObj.addedSkapps, inMemObj.deletedSkapps));
  }

  addPublicSpaceToAccount = async (evt) => {
    evt.preventDefault();
    let publicUpload = null;
    this.props.setLoaderDisplay(true);
    publicUpload = await savePublicSpace(this.state.hash, this.props.snPublicInMemory);
    this.props.setLoaderDisplay(false);
    const redirectToRoute = "/login" + "?" + PUBLIC_TO_ACC_QUERY_PARAM + "=" + (publicUpload?.skylink || this.state.hash);
    if (process.env.NODE_ENV === 'production') {
      document.location.href = SKYSPACE_HOSTNAME + "/#" + redirectToRoute;
    } else {
      this.props.setPublicHash(null);
      this.props.history.push(redirectToRoute);
    }
  }

  savePublicSpace = async (evt) => {
    evt.preventDefault();
    this.props.setLoaderDisplay(true);
    const publicHashData = await getPublicApps(this.state.hash);
    const skappListToSave = getAllPublicApps(publicHashData.data, this.props.snPublicInMemory.addedSkapps, this.props.snPublicInMemory.deletedSkapps);
    publicHashData.history[publicHashData.history.length - 1].skylink = this.state.hash;
    publicHashData.history.push({
      creationDate: new Date()
    });
    publicHashData.data = skappListToSave;
    const skylinkListFile = getSkylinkPublicShareFile(publicHashData);
    const portal = document.location.origin.indexOf("localhost") === -1 ? document.location.origin : DEFAULT_PORTAL;
    const uploadedContent = await new SkynetClient(portal).uploadFile(skylinkListFile);
    this.props.setLoaderDisplay(false);
    const newUrl = document.location.href.replace(
      this.state.hash,
      parseSkylink(uploadedContent)
    );
    this.setState({
      showInfoModal: true,
      infoModalContent: newUrl,
      onInfoModalClose: () => {
        this.setState({ showInfoModal: false });
        document.location.href = newUrl;
      }
    });
  }

  selectPublicAll = (evt, filteredApps) => {
    evt.preventDefault();
    this.setState({ isSelect: true, arrSelectedAps: filteredApps })
  }

  cancelPublicSelect = (evt) => {
    evt.preventDefault();
    this.setState({ isSelect: false, arrSelectedAps: [] });
  }

  publicSelect = (evt) => {
    evt.preventDefault();
    this.setState({ isSelect: true, arrSelectedAps: [] });
  }

  render() {
    const { goToApp, skyappId, fetchAllSkylinks } = this.state;
    const { classes } = this.props;
    const page = this.state.filterCriteria.page;
    const filterList = this.state.filterCriteria.tagFilterList;
    let filterCriteria = "";
    if (filterList != null && filterList.length > 0) {
      filterCriteria = filterList[0];
    }

    let cardCount = 0;
    const categoryWiseCount = this.getCategoryWiseCount();

    const skyspace = this.state.skyspace;
    if (goToApp) {
      const category = this.state.category;
      let source = "";
      if (category != null && category.trim() !== "") {
        source = "category";
      } else if (
        (skyspace != null && skyspace.trim() !== "") ||
        fetchAllSkylinks
      ) {
        source = "skyspace";
      }
      if (this.state.senderId != null) {
        return <Redirect to={`/imported-skyapps/${encodeURIComponent(this.state.senderId)}/${skyappId}?source=${source}`} />;
      } else {
        return <Redirect to={"/skyapps/" + skyappId + "?source=" + source} />;
      }
    }
    let filteredApps = this.getFilteredApps();


    return (
      <main className={this.state.hash ? classes.publicContent : classes.content}>
        <div style={{ paddingTop: 70, minHeight: "calc(100vh - 100px)" }}>

          <Grid
            container
            className="most_main_grid_gallery"
            spacing={3}
            style={{ width: "99%", margin: "auto" }}
          >
            <Grid item lg={2} md={2} sm={12} xs={12}>
              <Typography className={classes.gallery_title}>Spaces</Typography>
              <Typography className={classes.gallery_subTitle}>
                {this.state.hash == null && skyspace}
                {this.state.hash != null && "Public Space"}
              </Typography>
            </Grid>
            {filteredApps.length > 0 && <>
              <Grid
                item
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className={`${classes.gallery_title_btns_grid
                  } ${"most_main_grid_gallery_style"}`}
              >
                {/*  All */}
                <Typography
                  onClick={() => this.updateTagFilterList([])}
                  variant="span"
                  className={`gallery_title_head_Alltext ${classes.gallery_title_head_Alltext}`}
                  style={
                    this.state.filterCriteria != null &&
                      this.state.filterCriteria.tagFilterList.length === 0
                      ? { backgroundColor: "APP_BG_COLOR" }
                      : {}
                  }
                >
                  All
                    <Typography variant="span" className={classes.innerValue_All}>
                    {" "}
                    {this.props.snApps && this.props.snApps.length}
                  </Typography>
                </Typography>
                {Object.keys(getCategoryObjWithoutAll())
                  .filter(key => categoryWiseCount[key] && categoryWiseCount[key] != "0")
                  .map((key, idx) => (
                    <Typography
                      onClick={() => this.updateTagFilterList([key])}
                      variant="span"
                      key={idx}
                      className={`gallery_title_head_image_text ${classes.gallery_title_head_image_text}`}
                    >
                      {/* <CameraAltOutlinedIcon style={{ fontSize: "20px" }} /> */}
                        <span style={{ fontSize: "20px" }}>{CATEGORY_OBJ[key].getLogo(classes.categoryFilterLogo)}</span>
                        &nbsp; {getCategoryObjWithoutAll()[key].heading}
                      <Typography variant="span" className={classes.innerValue_All}>
                        {categoryWiseCount[key]
                          ? categoryWiseCount[key]
                          : 0}
                      </Typography>
                    </Typography>
                  ))}
              </Grid>
            </>}
            {this.isTrue ? null : (
              <>
                <Grid
                  item
                  lg={this.state.hash != null ? 12 : 6}
                  md={this.state.hash != null ? 12 : 6}
                  sm={12}
                  xs={12}
                  style={{ display: "flex", alignItems: "flex-end" }}
                >
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                  />
                  {this.state.hash != null && filteredApps.length > 0 &&
                    (
                      <label htmlFor="contained-button-file">
                        <Button
                          onClick={() => this.uploadEleRef.current.gridRef.current.click()}
                          variant="contained"
                          color="primary"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          type="button"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Upload
                    </Button>
                        <Button
                          variant="contained"
                          type="button"
                          onClick={this.addPublicSpaceToAccount}
                          color="primary"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Add To Skyspaces
                </Button>
                        <div className="d-none">
                          <SnUpload
                            name="files"
                            ref={this.uploadEleRef}
                            directoryMode={this.state.isDir}
                            onUpload={this.onPublicUpload}
                            portal={getPortalFromUserSetting(this.props.snUserSetting)}
                          />
                        </div>
                        <Button
                          variant="contained"
                          type="button"
                          onClick={this.savePublicSpace}
                          color="primary"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Save
                </Button>
                        <Button
                          variant="contained"
                          type="button"
                          onClick={this.deleteFromPublic}
                          color="primary"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Delete
                </Button>
                        <Button
                          variant="contained"
                          onClick={(evt)=>this.selectPublicAll(evt, filteredApps)}
                          color="primary"
                          type="button"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Select All
                </Button>
                        {!this.state.isSelect && (<Button
                          variant="contained"
                          onClick={this.publicSelect}
                          color="primary"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Select
                        </Button>)}
                        {this.state.isSelect && (<Button
                          onClick={this.cancelPublicSelect}
                          variant="contained"
                          color="primary"
                          style={{ color: "white", borderRadius: 10 }}
                          component="span"
                          startIcon={<PublishIcon style={{ color: "white" }} />}
                        >
                          Cancel
                        </Button>)}
                      </label>
                    )
                  }
                  {/* <span style={{ marginLeft: 20 }}></span>
                  <IconButton aria-label="delete" onClick={() => this.setGridUi(true)}>
                    <AppsIcon className={classes.appsIcon} />
                  </IconButton>

                  <IconButton aria-label="delete" onClick={() => this.setGridUi(false)}>
                    <ReorderIcon className={classes.reOrdered} />
                  </IconButton> */}
                </Grid>

                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {/* <LowPriorityIcon className={classes.lowPriorIcon} />
                  <FormControl className={classes.formControl}>
                    <Select
                      input={<BootstrapInput />}
                      inputProps={{
                        classes: {
                          icon: classes.icon,
                        },
                      }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={this.filterSelection}
                      disableUnderline={true}
                      onChange={this.handleChange}
                    >
                      <MenuItem value={"emp"} className={classes.menuColor}>
                        Latest filter
                  </MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl> */}
                  {this.state.hash == null && filteredApps.length > 0 && this.state.senderId == null && (
                    <>
                      {!this.state.isSelect &&
                        <Button
                          variant="contained"
                          onClick={() => this.setState({ isSelect: true, arrSelectedAps: [] })}
                          color="primary"
                          className={classes.sharedSpaceButn}
                          startIcon={<CheckCircleIcon style={{ color: "white" }} />}
                        >
                          Select
                        </Button>
                      }
                      {this.state.isSelect && (
                        <>
                          <Button
                            onClick={() => this.setState({ isSelect: false, arrSelectedAps: [] })}
                            variant="contained"
                            color="primary"
                            className={classes.sharedSpaceButn}
                          >
                            Cancel
                </Button>
                          <Button
                            onClick={() => this.setState({ arrSelectedAps: filteredApps })}
                            variant="contained"
                            color="primary"
                            className={classes.sharedSpaceButn}
                          >
                            Select All
              </Button>
                          <Button
                            onClick={() => this.setState({ arrSelectedAps: [] })}
                            variant="contained"
                            color="primary"
                            className={classes.sharedSpaceButn}
                          >
                            De-Select All
            </Button>
                          <Button
                            onClick={() => this.createSkylinkPublicShare()}
                            variant="contained"
                            color="primary"
                            className={classes.sharedSpaceButn}
                          >
                            Public Share
            </Button>
                        </>
                      )}
                    </>
                  )}
                </Grid>
              </>
            )}
          </Grid>

          {/* {this.GridUi ? this.getStepContent(this.state.activeStep) : this.getStepContentForList(this.state.activeStep)} */}
          {this.renderCards(filteredApps, page, cardCount, skyspace)}
          <Grid item xs={12}>
            {filterCriteria === 'audio' ?
              <AudioPlayer /> :
              <SnPagination
                page={page}
                totalCount={filteredApps.length}
                onChange={this.udpdatePage}
              />}
          </Grid>
        </div>
        <SnInfoModal
          open={this.state.showInfoModal}
          onClose={this.state.onInfoModalClose}
          title="Public Share Link"
          type="public-share"
          content={this.state.infoModalContent}
        />
      </main>
    );

    return (
      <div className="card-parent-conatiner">
        <div>
          <div>
            <Grid container spacing={1} className="align-self-auto">
              <Grid
                container
                spacing={1}
                direction="row"
                justify="space-between"
                alignItems="center"
                className="skyspaceMainPageHeader"
              >
                {this.state.hash == null && (<Grid item xs={12}>
                  {" "}
                  Space : {skyspace}
                </Grid>)}
                {this.state.hash != null && (<Grid item xs={12}>
                  Public Space
                </Grid>)}
              </Grid>
              {filteredApps.length > 0 && (<Grid item xs={12} sm={12} className="filter-grid">
                <>
                  <div className="category-filter">
                    <Chip label={
                      <div className="category-filter-chip">
                        All
                            <Avatar>
                          {this.props.snApps && this.props.snApps.length}
                        </Avatar>
                      </div>
                    }
                      onClick={() => this.updateTagFilterList([])}
                      className="cursor-pointer"
                      style={
                        this.state.filterCriteria != null &&
                          this.state.filterCriteria.tagFilterList.length === 0
                          ? { backgroundColor: APP_BG_COLOR }
                          : {}
                      }
                    />

                  </div>
                  {Object.keys(getCategoryObjWithoutAll())
                    .filter(key => categoryWiseCount[key] && categoryWiseCount[key] != "0")
                    .map((key, idx) => (
                      <div className="category-filter" key={idx} onClick={() => this.updateTagFilterList([key])}>
                        <Chip label={
                          <div className="category-filter-chip">
                            {getCategoryObjWithoutAll()[key].heading}
                            <Avatar>
                              {categoryWiseCount[key]
                                ? categoryWiseCount[key]
                                : 0}
                            </Avatar>
                          </div>
                        }
                          className="cursor-pointer"
                          style={
                            this.state.filterCriteria != null &&
                              this.state.filterCriteria.tagFilterList.indexOf(
                                key
                              ) > -1
                              ? { "background-color": APP_BG_COLOR }
                              : {}
                          }
                          icon={CATEGORY_OBJ[key].getLogo()}
                        />
                      </div>
                    ))}
                </>
              </Grid>)}
            </Grid>
          </div>

          <div className="card-container row">
            <Grid container spacing={1}>
              {this.state.hash != null && filteredApps.length > 0 && (
                <Grid item xs={12} className="public-cards-action">
                  <Button
                    variant="contained"
                    onClick={this.addPublicSpaceToAccount}
                    color="primary"
                    className="btn-bg-color"
                  >
                    Add To Skyspaces
                </Button>
                  <Button
                    variant="contained"
                    onClick={() => this.uploadEleRef.current.gridRef.current.click()}
                    color="primary"
                    className="btn-bg-color"
                  >
                    Upload
                </Button>
                  <FormControlLabel
                    className="no-gutters"
                    control={
                      <Switch
                        checked={this.isDir}
                        onChange={(evt) => this.setState({ isDir: evt.target.checked })}
                        name="checkedA"
                        className="app-bg-switch"
                      />
                    }
                    label="Directory"
                  />
                  <div className="d-none">
                    <SnUpload
                      name="files"
                      ref={this.uploadEleRef}
                      directoryMode={this.state.isDir}
                      onUpload={this.onPublicUpload}
                      portal={getPortalFromUserSetting(this.props.snUserSetting)}
                    />
                  </div>
                  <Button
                    variant="contained"
                    onClick={this.savePublicSpace}
                    color="primary"
                    className="btn-bg-color float-right"
                  >
                    Save
                </Button>
                  <Button
                    variant="contained"
                    onClick={this.deleteFromPublic}
                    color="primary"
                    className="btn-bg-color float-right"
                  >
                    Delete
                </Button>
                  <Button
                    variant="contained"
                    onClick={() => this.setState({ isSelect: true, arrSelectedAps: filteredApps })}
                    color="primary"
                    className="btn-bg-color float-right"
                  >
                    Select All
                </Button>
                  {!this.state.isSelect && (<Button
                    variant="contained"
                    onClick={() => this.setState({ isSelect: true, arrSelectedAps: [] })}
                    color="primary"
                    className="btn-bg-color float-right"
                  >
                    Select
                  </Button>)}
                  {this.state.isSelect && (<Button
                    onClick={() => this.setState({ isSelect: false, arrSelectedAps: [] })}
                    variant="contained"
                    color="primary"
                    className="btn-bg-color float-right"
                  >
                    Cancel
                  </Button>)}
                </Grid>
              )}
              {this.state.hash == null && filteredApps.length > 0 && this.state.senderId == null && (
                <Grid item xs={12} className="muti-cards-action">
                  {!this.state.isSelect && (

                    <Button
                      variant="contained"
                      onClick={() => this.setState({ isSelect: true, arrSelectedAps: [] })}
                      color="primary"
                      className="btn-bg-color"
                    >
                      Select
                    </Button>
                  )}
                  {this.state.isSelect && (
                    <>
                      <Button
                        onClick={() => this.setState({ isSelect: false, arrSelectedAps: [] })}
                        variant="contained"
                        color="primary"
                        className="btn-bg-color"
                      >
                        Cancel
                </Button>
                      <Button
                        onClick={() => this.setState({ arrSelectedAps: filteredApps })}
                        variant="contained"
                        color="primary"
                        className="btn-bg-color"
                      >
                        Select All
              </Button>
                      <Button
                        onClick={() => this.setState({ arrSelectedAps: [] })}
                        variant="contained"
                        color="primary"
                        className="btn-bg-color"
                      >
                        De-Select All
            </Button>
                      <Button
                        onClick={() => this.createSkylinkPublicShare()}
                        variant="contained"
                        color="primary"
                        className="btn-bg-color"
                      >
                        Public Share
            </Button>
                    </>
                  )}
                </Grid>
              )}
              {this.renderCards(filteredApps, page, cardCount, skyspace)}
              <Grid item xs={12}>
                {filterCriteria === 'audio' ?
                  <AudioPlayer /> :
                  <SnPagination
                    page={page}
                    totalCount={filteredApps.length}
                    onChange={this.udpdatePage}
                  />}
              </Grid>
            </Grid>
          </div>
        </div>
        <SnInfoModal
          open={this.state.showInfoModal}
          onClose={this.state.onInfoModalClose}
          title="Public Share Link"
          type="public-share"
          content={this.state.infoModalContent}
        />
        {this.state.hash && (<UploadProgress />)}
      </div>
    );
  }
}

export default withStyles(useStyles)(
  connect(mapStateToProps, matchDispatcherToProps)(SnCards)
);
