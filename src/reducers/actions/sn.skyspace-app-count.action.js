import { ACT_TY_SET_SKYSPACE_APP_COUNT, ACT_TY_FETCH_SKYSPACE_APP_COUNT } from "./sn.action.constants";
import { BROWSER_STORAGE, STORAGE_SKYSPACE_APP_COUNT_KEY } from "../../sn.constants";
import store from "../";


export const setSkyspaceAppCount = (obj)=> {
    if (obj==null){
        BROWSER_STORAGE.removeItem(STORAGE_SKYSPACE_APP_COUNT_KEY);
    } else {
        BROWSER_STORAGE.setItem(STORAGE_SKYSPACE_APP_COUNT_KEY, JSON.stringify(obj));
    }
    return {
        type: ACT_TY_SET_SKYSPACE_APP_COUNT,
        payload: obj
    }
}

export const fetchSkyspaceAppCount = (userSession) => {
    if (userSession==null){
        userSession=store.getState().userSession;
    }
    return {
        type: ACT_TY_FETCH_SKYSPACE_APP_COUNT,
        payload: userSession
    };
}