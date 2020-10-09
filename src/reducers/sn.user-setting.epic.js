import { ACT_TY_FETCH_USER_SETTING } from "../reducers/actions/sn.action.constants";
import { ofType } from "redux-observable";
import { switchMap, map } from "rxjs/operators";
import { from } from "rxjs";
import { setUserSettingAction } from "../reducers/actions/sn.user-setting.action";
import { setLoaderDisplay } from "../reducers/actions/sn.loader.action";
import { bsGetUserSetting } from "../blockstack/blockstack-api";

export const snUserSettingEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_USER_SETTING),
    switchMap((action) => {
      console.log("user setting epic", action);
      setLoaderDisplay(true);
      return from(bsGetUserSetting(action.payload)).pipe(
        map((res) => {
          console.log(res);
          setLoaderDisplay(false);
          return setUserSettingAction(res);
        })
      );
    })
  );
