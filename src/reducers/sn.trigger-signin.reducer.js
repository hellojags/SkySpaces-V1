import { ACT_TY_TRIGGER_SIGNIN } from "../reducers/actions/sn.action.constants";

export default (state = false, action) => {
    switch(action.type){
        case ACT_TY_TRIGGER_SIGNIN:
            return action.payload;
        default:
            return state;
    }
}