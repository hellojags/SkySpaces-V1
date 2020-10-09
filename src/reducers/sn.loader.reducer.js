import { ACT_TY_CHANGE_LOADER_STATE } from "../reducers/actions/sn.action.constants"

export default (state = false, action)=> {
    switch(action.type){
        case ACT_TY_CHANGE_LOADER_STATE:
            return action.payload;
        default:
            return state;
    }
}