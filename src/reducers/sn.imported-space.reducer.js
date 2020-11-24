import { ACT_TY_SET_IMPORTED_SPACE } from "../reducers/actions/sn.action.constants";

export default (state = null, action) => {
  switch (action.type) {
    case ACT_TY_SET_IMPORTED_SPACE:
      return action.payload;
    default:
      return state;
  }
};
