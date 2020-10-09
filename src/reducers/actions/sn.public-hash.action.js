import { ACT_TY_SET_PUBLIC_HASH } from "./sn.action.constants";



export const setPublicHash = (hash) => {
  return {
    type: ACT_TY_SET_PUBLIC_HASH,
    payload: hash,
  };
};
