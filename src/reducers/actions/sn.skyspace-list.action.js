import { ACT_TY_SET_SKYSPACE_LIST,
    ACT_TY_FETCH_SKYSPACE_LIST } from "./sn.action.constants";
import { STORAGE_SKYSPACE_LIST_KEY, BROWSER_STORAGE } from "../../sn.constants";
import { fetchUserSetting } from "./sn.user-setting.action";
import { fetchSkyspaceAppCount } from "./sn.skyspace-app-count.action";
import store from "../";

export const setSkyspaceList = (skyspaceList) => {
    if (skyspaceList==null){
        BROWSER_STORAGE.removeItem(STORAGE_SKYSPACE_LIST_KEY);
    } else {
        BROWSER_STORAGE.setItem(STORAGE_SKYSPACE_LIST_KEY, JSON.stringify(skyspaceList));
    }
    store.dispatch(fetchUserSetting(null));
    store.dispatch(fetchSkyspaceAppCount());
    return {
        type: ACT_TY_SET_SKYSPACE_LIST,
        payload: skyspaceList
    };
}

export const fetchSkyspaceList = (userSession) => {
    if (userSession==null){
        userSession=store.getState().userSession;
    }
    return {
        type: ACT_TY_FETCH_SKYSPACE_LIST,
        payload: userSession
    };
}