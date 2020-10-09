import {
  ACT_TY_SET_APP_SKYSPACES,
  ACT_TY_FETCH_APP_SKYSPACES_SUCCESS,
} from "../reducers/actions/sn.action.constants";

export default (state = [], action) => {
  switch (action.type) {
    case ACT_TY_SET_APP_SKYSPACES:
    case ACT_TY_FETCH_APP_SKYSPACES_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};
