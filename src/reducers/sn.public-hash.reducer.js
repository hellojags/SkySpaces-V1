import { ACT_TY_SET_PUBLIC_HASH } from "../reducers/actions/sn.action.constants"

export default (state = null, action)=> {
    switch(action.type){
        case ACT_TY_SET_PUBLIC_HASH:
            return action.payload;
        default:
            return state;
    }
}