import { bindActionCreators } from "redux";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import {
  fetchApps,
  fetchSkyspaceApps,
  fetchAllSkylinks,
  fetchPublicApps,
  setApps
} from "../../reducers/actions/sn.apps.action";
import { fetchSkyspaceDetail } from "../../reducers/actions/sn.skyspace-detail.action";
import { setPublicHash } from "../../reducers/actions/sn.public-hash.action";
import { setDesktopMenuState } from "../../reducers/actions/sn.desktop-menu.action";
import { setPortalsListAction } from "../../reducers/actions/sn.portals.action";
import { setPublicInMemory } from "../../reducers/actions/sn.public-in-memory.action";

export function matchDispatcherToProps(dispatcher) {
  return bindActionCreators(
    {
      setLoaderDisplay,
      fetchApps: fetchApps,
      fetchSkyspaceApps,
      fetchAllSkylinks,
      fetchSkyspaceDetail,
      fetchPublicApps,
      setDesktopMenuState,
      setPortalsListAction,
      setPublicHash,
      setPublicInMemory,
      setApps
    },
    dispatcher
  );
}

export function mapStateToProps(state) {
  return {
    isShowing: state.snLoader,
    snApps: state.snApps,
    userSession: state.userSession,
    snSkyspaceDetail: state.snSkyspaceDetail,
    snUserSetting: state.snUserSetting,
    snPublicInMemory: state.snPublicInMemory
  };
}
