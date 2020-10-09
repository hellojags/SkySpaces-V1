import { bindActionCreators } from "redux";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import {
  fetchAppDetail,
  fetchEmptyApp,
  createSkapp,
  fetchSkyspaceAppDetail,
} from "../../reducers/actions/sn.app-detail.action";
import { setAppSkyspces } from "../../reducers/actions/sn.app-skyspacelist.action";
import { setInfoModalState } from "../../reducers/actions/sn.info.modal.action";
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
    snInfoModalState: state.snInfoModalState,
    snAppSkyspaces: state.snAppSkyspaceList,
    snUserSetting: state.snUserSetting,
    snAppSkyspacesToChange: JSON.parse(JSON.stringify(state.snAppSkyspaceList)),
  };
}
