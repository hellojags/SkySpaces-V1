import { ACT_TY_CHANGE_LOADER_STATE } from "./sn.action.constants";

export const setLoaderDisplay = (newLoaderState) => {
  return {
    type: ACT_TY_CHANGE_LOADER_STATE,
    payload: newLoaderState,
  };
};
