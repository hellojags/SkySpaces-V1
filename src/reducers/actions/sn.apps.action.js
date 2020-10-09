import {
  ACT_TY_FETCH_APPS,
  ACT_TY_FETCH_APPS_SUCCESS,
  ACT_TY_FETCH_SKYSPACE_APPS,
  ACT_TY_FETCH_SKYSPACE_APPS_SUCCESS,
  ACT_TY_FETCH_ALL_SKYLINKS,
  ACT_TY_FETCH_PUBLIC_APPS,
  ACT_TY_SET_APPS
} from "./sn.action.constants";
import { setLoaderDisplay } from "./sn.loader.action";
import store from "..";

export const fetchApps = (args) => {
  store.dispatch(setLoaderDisplay(true));
  return {
    type: ACT_TY_FETCH_APPS,
    payload: args,
  };
};

export const fetchPublicApps = (args) => {
  store.dispatch(setLoaderDisplay(true));
  return {
    type: ACT_TY_FETCH_PUBLIC_APPS,
    payload: args,
  };
}

export const fetchAppsSuccess = (args) => {
  store.dispatch(setLoaderDisplay(false));
  return {
    type: ACT_TY_FETCH_APPS_SUCCESS,
    payload: args,
  };
};

export const setApps = (args) => {
  return {
    type: ACT_TY_SET_APPS,
    payload: args,
  };
};

export const fetchAllSkylinks = (args) => {
  store.dispatch(setLoaderDisplay(false));
  console.log("fetchAllSkylinks action usersession", args);
  return {
    type: ACT_TY_FETCH_ALL_SKYLINKS,
    payload: args.session,
  };
};

export const fetchSkyspaceAppsSuccess = (args) => {
  store.dispatch(setLoaderDisplay(false));
  return {
    type: ACT_TY_FETCH_SKYSPACE_APPS_SUCCESS,
    payload: args,
  };
};

export const fetchSkyspaceApps = (args) => {
  console.log("fetchSkyspaceApps actio called");
  store.dispatch(setLoaderDisplay(true));
  return {
    type: ACT_TY_FETCH_SKYSPACE_APPS,
    payload: args,
  };
};
