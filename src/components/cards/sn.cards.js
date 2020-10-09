import React from "react";
import { Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { INITIAL_PORTALS_OBJ } from "../../blockstack/constants";
import SnUpload from "../new/sn.upload";
import { v4 as uuidv4 } from 'uuid';
import { SkynetClient, parseSkylink } from "skynet-js";
import { getEmptyHistoryObject, getEmptySkylinkObject } from "../new/sn.new.constants";
import BlockIcon from '@material-ui/icons/Block';
import { Button, FormControlLabel, Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Avatar from '@material-ui/core/Avatar';
import IconButton from "@material-ui/core/IconButton";
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
  PUBLIC_SHARE_APP_HASH, SKYSPACE_DEFAULT_PATH, PUBLIC_TO_ACC_QUERY_PARAM
} from "../../sn.constants";
import {
  CATEGORY_OBJ,
  getCategoryObjWithoutAll,
} from "../../sn.category-constants";
import { connect } from "react-redux";
import { mapStateToProps, matchDispatcherToProps } from "./sn.cards.container";
import { bsGetSkyspaceNamesforSkhubId, bsGetAllSkyspaceObj, bsAddToHistory } from "../../blockstack/blockstack-api";
import SnPagination from "../tools/sn.pagination";
import { INITIAL_SETTINGS_OBJ } from "../../blockstack/constants";
import Chip from '@material-ui/core/Chip';
import UploadProgress from "../upload/UploadProgress/UploadProgress";
import { getSkylinkPublicShareFile, savePublicSpace } from "../../skynet/sn.api.skynet";

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

class SnCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goToApp: false,
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
      isDir: false
    };
    this.openSkyApp = this.openSkyApp.bind(this);
    this.handleSrchSbmt = this.handleSrchSbmt.bind(this);
    this.handleSrchKeyChng = this.handleSrchKeyChng.bind(this);
    this.getFilteredApps = this.getFilteredApps.bind(this);
    this.uploadEleRef = React.createRef();
  }



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

  getAppList(category, skyspace, fetchAllSkylinks, hash) {
    category != null && this.props.fetchApps(category);
    skyspace != null &&
      this.props.fetchSkyspaceApps({
        session: this.props.userSession,
        skyspace: skyspace,
      });
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

  componentDidMount() {
    const skyspace = this.props.match.params.skyspace;
    const category = this.props.match.params.category;
    const queryHash = this.props.location.search.replace("?sialink=", "").trim();
    const hash = queryHash === "" ? null : queryHash;
    hash && this.props.setPublicHash(hash);
    const fetchAllSkylinks = this.props.match.path === "/skylinks";
    this.setState({
      skyspace,
      category,
      fetchAllSkylinks: fetchAllSkylinks,
      page: 1,
      hash
    });
    this.props.fetchSkyspaceDetail();
    this.getAppList(category, skyspace, fetchAllSkylinks, hash);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const skyspace = this.props.match.params.skyspace;
    const category = this.props.match.params.category;
    const queryHash = this.props.location.search.replace("?sialink=", "").trim();
    const hash = queryHash === "" ? null : queryHash;
    const fetchAllSkylinks = this.props.match.path === "/skylinks";
    console.log("cards component updated");
    if (
      this.state.category !== category ||
      this.state.hash !== hash ||
      this.state.skyspace !== skyspace ||
      this.state.fetchAllSkylinks !== fetchAllSkylinks ||
      (fetchAllSkylinks &&
        this.getSearchKeyFromQuery() !== this.state.searchKey)
    ) {
      console.log("truly updated");
      this.props.fetchSkyspaceDetail();
      this.updateTagFilterList([]);
      this.setState({
        skyspace,
        hash,
        fetchAllSkylinks: fetchAllSkylinks,
        category,
        page: 1,
      });
      hash && this.props.setPublicHash(hash);
      this.getAppList(category, skyspace, fetchAllSkylinks, hash);
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
          )
      );
    } else {
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
      const uploadedContent = await new SkynetClient(portal).upload(skylinkListFile);
      let historyObj = getEmptyHistoryObject();
      historyObj.fileName = "Public Share";
      historyObj.skylink = uploadedContent.skylink;
      historyObj.action = "Public Share";
      bsAddToHistory(this.props.userSession, historyObj);
      this.setState({
        showInfoModal: true,
        infoModalContent: `${this.props.snUserSetting.setting.portal}${PUBLIC_SHARE_APP_HASH}/#/${PUBLIC_SHARE_ROUTE}?sialink=${uploadedContent.skylink}`
      })
      this.props.setLoaderDisplay(false);
    }
  }

  deleteFromPublic = (evt) => {
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

  addPublicSpaceToAccount = async () => {
    let publicUpload = null;
    // if (this.props.snPublicInMemory.addedSkapps?.length>0 || this.props.snPublicInMemory.deletedSkapps?.length>0) {
    this.props.setLoaderDisplay(true);
    publicUpload = await savePublicSpace(this.state.hash, this.props.snPublicInMemory);
    this.props.setLoaderDisplay(false);
    // }
    document.location.href = SKYSPACE_DEFAULT_PATH + "?" + PUBLIC_TO_ACC_QUERY_PARAM + "=" + (publicUpload?.skylink || this.state.hash);
  }

  render() {
    const { goToApp, skyappId, fetchAllSkylinks } = this.state;
    const page = this.state.filterCriteria.page;
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
      return <Redirect to={"/skyapps/" + skyappId + "?source=" + source} />;
    }
    let filteredApps = this.getFilteredApps();

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
                    onClick={() => this.uploadEleRef.current.click()}
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
              {this.state.hash == null && filteredApps.length > 0 && (
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
                <SnPagination
                  page={page}
                  totalCount={filteredApps.length}
                  onChange={this.udpdatePage}
                />
              </Grid>
            </Grid>
          </div>
        </div>
        <SnInfoModal
          open={this.state.showInfoModal}
          onClose={() => this.setState({ showInfoModal: false })}
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
