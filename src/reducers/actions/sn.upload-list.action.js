import { ACT_TY_SET_UPLOAD_LIST } from "./sn.action.constants";


export const setUploadList = (list) => {
    return {
        type: ACT_TY_SET_UPLOAD_LIST,
        payload: list
    };
};