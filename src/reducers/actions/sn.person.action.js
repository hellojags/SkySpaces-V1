import {
  ACT_TY_SET_BLOCKSTACK_USER,
  ACT_TY_FETCH_BLOCKSTACK_USER,
  ACT_TY_LOGOUT_BLOCKSTACK_USER,
} from "./sn.action.constants";
import { STORAGE_USER_KEY, BROWSER_STORAGE } from "../../sn.constants";
import { setSkyspaceList, fetchSkyspaceList } from "./sn.skyspace-list.action";
import store from "../";

export const setPerson = (state) => {
  if (state == null) {
    BROWSER_STORAGE.removeItem(STORAGE_USER_KEY);
  } else {
    BROWSER_STORAGE.setItem(STORAGE_USER_KEY, JSON.stringify(state));
  }
  return {
    type: ACT_TY_SET_BLOCKSTACK_USER,
    payload: state,
  };
};

export const setPersonGetOtherData = (state) => {
  store.dispatch(fetchSkyspaceList(null));
  return setPerson(state);
};

export const fetchBlockstackPerson = (userSession) => {
  return {
    type: ACT_TY_FETCH_BLOCKSTACK_USER,
    payload: userSession,
  };
};

export const logoutPerson = (userSession) => {
  BROWSER_STORAGE.clear();
  store.dispatch(setSkyspaceList(null));
  return {
    type: ACT_TY_LOGOUT_BLOCKSTACK_USER,
    payload: userSession,
  };
};
