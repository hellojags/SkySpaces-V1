import { setLoaderDisplay } from "./sn.loader.action";
import { fetchSkyspaceAppDetail } from "./sn.app-detail.action";
import {
  ACT_TY_FETCH_APP_SKYSPACES,
  ACT_TY_FETCH_APP_SKYSPACES_SUCCESS,
  ACT_TY_SET_APP_SKYSPACES,
  ACT_TY_FETCH_APP_SKYSPACES_AND_SKYSPACE_APP,
} from "./sn.action.constants";
import store from "../";

export const fetchAppSkyspaces = (args) => {
  store.dispatch(setLoaderDisplay(true));
  console.log(args);
  return {
    type: ACT_TY_FETCH_APP_SKYSPACES,
    payload: args,
  };
};

export const fetchAppSkyspacesAndSkyspaceApp = (args) => {
  store.dispatch(setLoaderDisplay(true));
  console.log(args);
  return {
    type: ACT_TY_FETCH_APP_SKYSPACES_AND_SKYSPACE_APP,
    payload: args,
  };
};

export const fetchAppSkyspacesSuccess = (args) => {
  store.dispatch(setLoaderDisplay(false));
  console.log("in fetchAppSkyspacesSuccess action", args);
  return {
    type: ACT_TY_FETCH_APP_SKYSPACES_SUCCESS,
    payload: args,
  };
};

export const fetchAppSkyspacesAndSkyspaceAppSuccess = (args, fetchAppArgs) => {
  store.dispatch(setLoaderDisplay(false));
  store.dispatch(
    fetchSkyspaceAppDetail({
      skyAppId: fetchAppArgs.skyAppId,
      session: fetchAppArgs.session,
    })
  );
  return {
    type: ACT_TY_FETCH_APP_SKYSPACES_SUCCESS,
    payload: args,
  };
};

export const setAppSkyspces = (args) => {
  return {
    type: ACT_TY_SET_APP_SKYSPACES,
    payload: args,
  };
};
