import { ACT_TY_SET_PUBLIC_IN_MEMORY } from "../reducers/actions/sn.action.constants"

export default (state = { addedSkapps: [], deletedSkapps:[]}, action)=> {
    switch(action.type){
        case ACT_TY_SET_PUBLIC_IN_MEMORY:
            return action.payload;
        default:
            return state;
    }
}