import { bindActionCreators } from "redux";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import { fetchAppDetail } from "../../reducers/actions/sn.app-detail.action";
import { fetchSkyspaceAppCount } from "../../reducers/actions/sn.skyspace-app-count.action";
import { fetchSkyspaceDetail } from "../../reducers/actions/sn.skyspace-detail.action";

export function matchDispatcherToProps(dispatcher) {
  return bindActionCreators(
    {
      setLoaderDisplay,
      fetchAppDetail,
      fetchSkyspaceAppCount,
      fetchSkyspaceDetail
    },
    dispatcher
  );
}

export function mapStateToProps(state) {
  return {
    isShowing: state.snLoader,
    snApps: state.snApps,
    snUserSetting: state.snUserSetting,
    snSkyspaceList: state.snSkyspaceList,
    userSession: state.userSession,
  };
}
