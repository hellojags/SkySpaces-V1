import { ACT_TY_CHANGE_TOPBAR_STATE } from "../reducers/actions/sn.action.constants"

export default (state = true, action)=> {
    switch(action.type){
        case ACT_TY_CHANGE_TOPBAR_STATE:
            return action.payload;
        default:
            return state;
    }
}