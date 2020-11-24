import { ACT_TY_SET_IMPORTED_SPACE } from "./sn.action.constants";

export const setImportedSpace = (args) => {
    return {
      type: ACT_TY_SET_IMPORTED_SPACE,
      payload: args,
    };
  };