import { ACT_TY_CHANGE_DESKTOP_MENU_STATE } from "./actions/sn.action.constants"

export default (state = true, action)=> {
    switch(action.type){
        case ACT_TY_CHANGE_DESKTOP_MENU_STATE:
            return action.payload;
        default:
            return state;
    }
}