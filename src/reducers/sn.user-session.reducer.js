import { ACT_TY_SET_USER_SESSION } from "../reducers/actions/sn.action.constants";
import { UserSession, AppConfig } from "blockstack";
import { BROWSER_STORAGE, STORAGE_USER_SESSION_KEY } from "../sn.constants";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig: appConfig });

const getUserSession = ()=>{
  let strUserSession=BROWSER_STORAGE.getItem(STORAGE_USER_SESSION_KEY);
  if (strUserSession!=null){
      return JSON.parse(strUserSession);
  } else {
    const appConfig = new AppConfig(["store_write", "publish_data"]);
    const userSession = new UserSession({ appConfig: appConfig });
    return userSession;
  }
}

export default (state = getUserSession(), action) => {
  switch (action.type) {
    case ACT_TY_SET_USER_SESSION:
      return action.payload;
    default:
      return state;
  }
};
