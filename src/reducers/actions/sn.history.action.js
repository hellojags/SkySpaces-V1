import { setLoaderDisplay } from "./sn.loader.action";
import {
  ACTY_TY_FETCH_HISTORY,
  ACTY_TY_SET_HISTORY,
} from "./sn.action.constants";
import store from "../";

export const fetchHistory = (args) => {
  store.dispatch(setLoaderDisplay(true));
  return {
    type: ACTY_TY_FETCH_HISTORY,
    payload: args,
  };
};

export const fetchHistorySuccess = (args) => {
  store.dispatch(setLoaderDisplay(false));
  return {
    type: ACTY_TY_SET_HISTORY,
    payload: args,
  };
};

export const setHistory = (args) => {
  store.dispatch(setLoaderDisplay(true));
  return {
    type: ACTY_TY_FETCH_HISTORY,
    payload: args,
  };
};
