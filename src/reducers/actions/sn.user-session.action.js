import { ACT_TY_SET_USER_SESSION } from "./sn.action.constants";


export const setUserSession = (userSession) => {
    return {
        type: ACT_TY_SET_USER_SESSION,
        payload: userSession
    };
}