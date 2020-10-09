import { bindActionCreators } from "redux";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";

export function matchDispatcherToProps(dispatcher) {
  return bindActionCreators(
    {
      setLoaderDisplay,
      //fetchSkySpaceApp
    },
    dispatcher
  );
}

export function mapStateToProps(state) {
  return {
    isShowing: state.snLoader,
    snApps: state.snApps,
  };
}
