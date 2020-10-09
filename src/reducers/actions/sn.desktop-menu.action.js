import { ACT_TY_CHANGE_DESKTOP_MENU_STATE } from "./sn.action.constants";
import store from "..";

export const setDesktopMenuState = (newMenuState) => {
    return {
        type: ACT_TY_CHANGE_DESKTOP_MENU_STATE,
        payload: newMenuState
    };
}
export const toggleDesktopMenuDisplay = ()=>{
    return setDesktopMenuState(!store.getState().snShowDesktopMenu);
}
