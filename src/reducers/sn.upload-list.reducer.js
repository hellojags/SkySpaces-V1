import { ACT_TY_SET_UPLOAD_LIST } from "../reducers/actions/sn.action.constants"

export default (state = [], action)=> {
    switch(action.type){
        case ACT_TY_SET_UPLOAD_LIST:
            return action.payload;
        default:
            return state;
    }
}