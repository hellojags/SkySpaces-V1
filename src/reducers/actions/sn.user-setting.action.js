import { ACT_TY_SET_USER_SETTING,
    ACT_TY_FETCH_USER_SETTING } from "./sn.action.constants";
    import store from "../";
    import { STORAGE_USER_SETTING_KEY, BROWSER_STORAGE } from "../../sn.constants";



export const setUserSettingAction = (setting) => {
  if (setting==null){
    BROWSER_STORAGE.removeItem(STORAGE_USER_SETTING_KEY);
} else {
    BROWSER_STORAGE.setItem(STORAGE_USER_SETTING_KEY, JSON.stringify(setting));
}
  return {
    type: ACT_TY_SET_USER_SETTING,
    payload: setting,
  };
};

export const fetchUserSetting = (session) => {
    session = session!=null ? session : store.getState().userSession;
    return {
      type: ACT_TY_FETCH_USER_SETTING,
      payload: session,
    };
  };
