import { combineReducers } from "redux";
import { createStore } from "redux";
import SnLoaderReducer from "./sn.loader.reducer";
import SnMobileMenuReducer from "./sn.mobile-menu.reducer";
import SnDesktopMenuReducer from "./sn.desktop-menu.reducer";
import SnAppsReducer from "./sn.apps.reducers";
import SnPublicHash from "./sn.public-hash.reducer";
import SnAppDetailReducer from "./sn.app-detail.reducer";
import SnInfoModalReducer from "./sn.info.modal.reducer";
import SnUserSessionReducer from "./sn.user-session.reducer";
import SnTriggerSignInReducer from "./sn.trigger-signin.reducer";
import SnSkyspaceDetailReducer from "./sn.skyspace-detail.reducer";
import SnUserSettingReducer from "./sn.user-settings.reducer";
import SnSkyspaceAppCount from "./sn.skyspace-app-count.reducer";
import SnSkyspaceListReducer from "./sn.skyspace-list.reducer";
import SnTopbarDisplay from "./sn.topbar-display.reducer";
import SnPortalsListReducer from "./sn.portals.reducer";
import SnPublicInMemory from "./sn.public-in-memory.reducer";
import { appsEpic, skyspaceAppsEpic, allSkylinksEpic, publicAppsEpic } from "./sn.apps.epic";
import { combineEpics } from "redux-observable";
import { appDetailEpic, skyspaceAppDetailEpic } from "./sn.app-detail.epic";
import { createAppEpic } from "./sn.creat-app.epic";
import { snUserSettingEpic } from "./sn.user-setting.epic";
import { snSetSkypaceDetailEpic } from "./sn.skyspace-detail.epic";
import { snPersonEpic, logoutPersonEpic } from "./sn.person.epic";
import { snSetSkypaceListEpic } from "./sn.skyspace-list.epic";
import { snAppSkyspacelistEpic } from "./sn.app-skyspacelist.epic";
import { snSkyspaceAppCountEpic } from "./sn.skyspace-app-count.epic";
import { fetchHistoryEpic } from "./sn.history.epic";
import { snPortalsListEpic } from "./sn.portals.epic";
import SnPerson from "./sn.person.reducer";
import SnAppSkyspaceList from "./sn.app-skyspacelist.reducer";
import SnImportedSpace from "./sn.imported-space.reducer";
import SnHistory from "./sn.history.reducer";
import SnUploadListReducer from "./sn.upload-list.reducer";
import SnAudioPlayerReducer from "./sn.audio-player.reducer";
import { composeWithDevTools } from 'redux-devtools-extension';
const redux = require("redux");

const { createEpicMiddleware } = require("redux-observable");

const allReducers = combineReducers({
  snLoader: SnLoaderReducer,
  snShowMobileMenu: SnMobileMenuReducer,
  snShowDesktopMenu: SnDesktopMenuReducer,
  snApps: SnAppsReducer,
  snAppDetail: SnAppDetailReducer,
  snInfoModalState: SnInfoModalReducer,
  userSession: SnUserSessionReducer,
  person: SnPerson,
  snSkyspaceList: SnSkyspaceListReducer,
  snPortalsList: SnPortalsListReducer,
  snAppSkyspaceList: SnAppSkyspaceList,
  snHistory: SnHistory,
  snTriggerSignin: SnTriggerSignInReducer,
  snUserSetting: SnUserSettingReducer,
  snSkyspaceAppCount: SnSkyspaceAppCount,
  snTopbarDisplay: SnTopbarDisplay,
  snSkyspaceDetail: SnSkyspaceDetailReducer,
  snPublicHash: SnPublicHash,
  snPublicInMemory: SnPublicInMemory,
  snUploadList: SnUploadListReducer,
  SnAudioPlayer: SnAudioPlayerReducer,
  snImportedSpace: SnImportedSpace
});

const rootEpic = combineEpics(
  appsEpic,
  appDetailEpic,
  createAppEpic,
  skyspaceAppsEpic,
  snPersonEpic,
  logoutPersonEpic,
  snSetSkypaceListEpic,
  skyspaceAppDetailEpic,
  snAppSkyspacelistEpic,
  fetchHistoryEpic,
  snPortalsListEpic,
  snUserSettingEpic,
  allSkylinksEpic,
  snSkyspaceAppCountEpic,
  snSetSkypaceDetailEpic,
  publicAppsEpic
);

const observableMiddleware = createEpicMiddleware();
const store = createStore(
  allReducers, composeWithDevTools(
  redux.applyMiddleware(observableMiddleware)
  )
);
observableMiddleware.run(rootEpic);

export default store;
