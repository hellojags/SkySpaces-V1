import { ACT_TY_CHANGE_INFO_MODAL_STATE } from "./sn.action.constants";

export const setInfoModalState = (newState) => {
    console.log("info modal action : ", newState)
    return {
        type: ACT_TY_CHANGE_INFO_MODAL_STATE,
        payload: newState
    };
}
