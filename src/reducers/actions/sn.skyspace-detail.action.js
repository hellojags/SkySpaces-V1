import { ACT_TY_SET_SKYSPACE_DETAIL,
    ACT_TY_FETCH_SKYSPACE_DETAIL } from "./sn.action.constants";
import { STORAGE_SKYSPACE_DETAIL_KEY, BROWSER_STORAGE } from "../../sn.constants";
import store from "../";

export const setSkyspaceDetail = (skyspaceDetail) => {
    if (skyspaceDetail==null){
        BROWSER_STORAGE.removeItem(STORAGE_SKYSPACE_DETAIL_KEY);
    } else {
        BROWSER_STORAGE.setItem(STORAGE_SKYSPACE_DETAIL_KEY, JSON.stringify(skyspaceDetail));
    }
    return {
        type: ACT_TY_SET_SKYSPACE_DETAIL,
        payload: skyspaceDetail
    };
}

export const fetchSkyspaceDetail = (userSession) => {
    if (userSession==null){
        userSession=store.getState().userSession;
    }
    return {
        type: ACT_TY_FETCH_SKYSPACE_DETAIL,
        payload: userSession
    };
}