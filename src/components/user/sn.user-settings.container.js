import { bindActionCreators } from "redux";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import {
  fetchAppDetail,
  fetchEmptyApp,
  createSkapp,
  fetchSkyspaceAppDetail,
} from "../../reducers/actions/sn.app-detail.action";
import { setAppSkyspces } from "../../reducers/actions/sn.app-skyspacelist.action";
import {
  fetchSkyspaceList,
} from "../../reducers/actions/sn.skyspace-list.action";
import { setInfoModalState } from "../../reducers/actions/sn.info.modal.action";
import { setUserSettingAction } from "../../reducers/actions/sn.user-setting.action";
import { setPortalsListAction, fetchPortalsListAction} from "../../reducers/actions/sn.portals.action";
import { fetchSkyspaceAppCount } from "../../reducers/actions/sn.skyspace-app-count.action";

export function matchDispatcherToProps(dispatcher) {
  return bindActionCreators(
    {
      setLoaderDisplay,
      fetchAppDetail,
      fetchSkyspaceAppDetail,
      fetchEmptyApp,
      createSkapp,
      setInfoModalState,
      setAppSkyspces,
      setUserSettingAction,
      setPortalsListAction,
      fetchPortalsListAction,
      fetchSkyspaceList,
      fetchSkyspaceAppCount
    },
    dispatcher
  );
}

export function mapStateToProps(state) {
  return {
    isShowing: state.snLoader,
    skyapp: state.snAppDetail,
    userSession: state.userSession,
    person: state.person,
    snSkyspaceList: state.snSkyspaceList,
    snPortalsList: state.snPortalsList,
    snInfoModalState: state.snInfoModalState,
    snAppSkyspaces: state.snAppSkyspaceList,
    snAppSkyspacesToChange: JSON.parse(JSON.stringify(state.snAppSkyspaceList)),
  };
}
