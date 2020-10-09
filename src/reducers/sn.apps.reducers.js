import {
  ACT_TY_FETCH_APPS,
  ACT_TY_FETCH_APPS_SUCCESS,
  ACT_TY_FETCH_SKYSPACE_APPS_SUCCESS,
  ACT_TY_SET_APPS
} from "../reducers/actions/sn.action.constants";

export default (state = [], action) => {
  switch (action.type) {
    case ACT_TY_FETCH_APPS:
      return state;
    case ACT_TY_FETCH_APPS_SUCCESS:
    case ACT_TY_SET_APPS:
      return action.payload;
    case ACT_TY_FETCH_SKYSPACE_APPS_SUCCESS:
      return action.payload;
    case "STATIC_USERS":
      return action.payload;
    default:
      return state;
  }
};
