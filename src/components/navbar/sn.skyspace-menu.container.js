import { bindActionCreators } from "redux";
import {
  setMobileMenuDisplay,
  toggleMobileMenuDisplay,
} from "../../reducers/actions/sn.mobile-menu.action";
import {
  fetchSkyspaceList,
  setSkyspaceList,
} from "../../reducers/actions/sn.skyspace-list.action";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import { fetchSkyspaceAppCount } from "../../reducers/actions/sn.skyspace-app-count.action";
import { fetchSkyspaceDetail } from "../../reducers/actions/sn.skyspace-detail.action";

export function matchDispatcherToProps(dispatcher) {
  return bindActionCreators(
    {
      setMobileMenuDisplay,
      toggleMobileMenuDisplay,
      fetchSkyspaceList,
      setLoaderDisplay,
      setSkyspaceList,
      fetchSkyspaceAppCount,
      fetchSkyspaceDetail
    },
    dispatcher
  );
}

export function mapStateToProps(state) {
  return {
    showMobileMenu: state.snShowMobileMenu,
    userSession: state.userSession,
    skyspaceList: state.snSkyspaceList,
    person: state.person,
    snSkyspaceAppCount: state.snSkyspaceAppCount
  };
}
