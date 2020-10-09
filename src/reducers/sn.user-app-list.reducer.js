import { ACT_TY_SET_USER_SESSION } from "../reducers/actions/sn.action.constants";
import {
    UserSession,
    AppConfig
  } from 'blockstack';

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig: appConfig });

export default (state = [], action) => {
    switch(action.type){
        case ACT_TY_SET_USER_SESSION:
            return action.payload;
        default:
            return state;
    }
}