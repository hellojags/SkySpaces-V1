import { ACT_TY_SET_PORTALS_LIST } from "../reducers/actions/sn.action.constants"
import { STORAGE_PORTALS_LIST_KEY, BROWSER_STORAGE } from "../sn.constants";

export default (state = null, action)=> {
    switch(action.type){
        case ACT_TY_SET_PORTALS_LIST:
            return action.payload;
        default:
            if (state == null) {
                state = BROWSER_STORAGE.getItem(STORAGE_PORTALS_LIST_KEY);
                if (state != null) {
                  state = JSON.parse(state);
                }
              }
            return state;
    }
}