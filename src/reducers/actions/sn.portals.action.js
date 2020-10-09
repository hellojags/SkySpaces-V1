import { ACT_TY_SET_PORTALS_LIST,
    ACT_TY_FETCH_PORTALS_LIST } from "./sn.action.constants";
    import store from "../";
    import { STORAGE_PORTALS_LIST_KEY, BROWSER_STORAGE } from "../../sn.constants";



export const setPortalsListAction = (portals) => {
  if (portals==null){
    BROWSER_STORAGE.removeItem(STORAGE_PORTALS_LIST_KEY);
} else {
    BROWSER_STORAGE.setItem(STORAGE_PORTALS_LIST_KEY, JSON.stringify(portals));
}
  return {
    type: ACT_TY_SET_PORTALS_LIST,
    payload: portals,
  };
};

export const fetchPortalsListAction = (session) => {
    session = session!=null ? session : store.getState().userSession;
    return {
      type: ACT_TY_FETCH_PORTALS_LIST,
      payload: session,
    };
  };
