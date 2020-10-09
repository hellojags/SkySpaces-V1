import { ACT_TY_CHANGE_MOBILE_MENU_STATE } from "../reducers/actions/sn.action.constants"

export default (state = false, action)=> {
    switch(action.type){
        case ACT_TY_CHANGE_MOBILE_MENU_STATE:
            return action.payload;
        default:
            return state;
    }
}