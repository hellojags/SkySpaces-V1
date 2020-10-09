import { ACT_TY_CHANGE_INFO_MODAL_STATE } from "../reducers/actions/sn.action.constants"

export default (state = false, action)=> {
    switch(action.type){
        case ACT_TY_CHANGE_INFO_MODAL_STATE:
            console.log("changing info modal state");
            return action.payload;
        default:
            return state;
    }
}