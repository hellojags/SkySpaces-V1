import { bindActionCreators } from "redux";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import { fetchHistory } from "../../reducers/actions/sn.history.action";
import {setSkappDetail} from "../../reducers/actions/sn.app-detail.action";
export function matchDispatcherToProps(dispatcher) {
  return bindActionCreators(
    {
      setLoaderDisplay,
      fetchHistory,
      setSkappDetail,
    },
    dispatcher
  );
}

export function mapStateToProps(state) {
  return {
    userSession: state.userSession,
    history: state.snHistory,
    person: state.person,
    skyapp: state.snAppDetail,
  };
}
