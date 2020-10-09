import { setLoaderDisplay } from "./sn.loader.action";
import { setInfoModalState } from "./sn.info.modal.action";
import { fetchAppSkyspaces } from "./sn.app-skyspacelist.action";
import {
  ACT_TY_FETCH_APP_DETAIL,
  ACT_TY_FETCH_APP_DETAIL_SUCCESS,
  ACT_TY_FETCH_EMPTY_APP,
  ACT_TY_CREATE_SKAPP,
  ACT_TY_CREATE_SKAPP_SUCCESS,
  ACT_TY_FETCH_SKYSPACE_APP_DETAIL,
} from "./sn.action.constants";
import store from "../";

export const fetchAppDetail = (args) => {
  store.dispatch(setLoaderDisplay(true));
  return {
    type: ACT_TY_FETCH_APP_DETAIL,
    payload: args,
  };
};

export const fetchSkyspaceAppDetail = (args) => {
  store.dispatch(setLoaderDisplay(true));
  return {
    type: ACT_TY_FETCH_SKYSPACE_APP_DETAIL,
    payload: args,
  };
};

export const fetchEmptyApp = () => {
  return {
    type: ACT_TY_FETCH_EMPTY_APP,
  };
};

export const fetchAppDetailSuccess = (args) => {
  store.dispatch(setLoaderDisplay(false));
  if (args.param != null) {
    store.dispatch(fetchAppSkyspaces(args.param));
  }
  return {
    type: ACT_TY_FETCH_APP_DETAIL_SUCCESS,
    payload: args.res,
  };
};

export const createSkapp = (skappObj) => {
  store.dispatch(setLoaderDisplay(true));
  console.log("create skapp action called");
  return {
    type: ACT_TY_CREATE_SKAPP,
    payload: skappObj,
  };
};
export const setSkappDetail = (skappObj) => {
  return {
    type: ACT_TY_CREATE_SKAPP_SUCCESS,
    payload: skappObj,
  };
};

export const createSkappSuccess = (skappObj) => {
  store.dispatch(setLoaderDisplay(false));
  store.dispatch(setInfoModalState(true));
  return {
    type: ACT_TY_CREATE_SKAPP_SUCCESS,
    payload: skappObj,
  };
};
