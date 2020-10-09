import {
  ACT_TY_FETCH_APP_DETAIL,
  ACT_TY_FETCH_SKYSPACE_APP_DETAIL,
} from "../reducers/actions/sn.action.constants";
import { ofType } from "redux-observable";
import { switchMap, map } from "rxjs/operators";
import { from } from "rxjs";
import { fetchSkyAppDetails } from "../api/sn.api";
import { fetchAppDetailSuccess,fetchSkyspaceAppDetail } from "../reducers/actions/sn.app-detail.action";
import { getSkylink } from "../blockstack/blockstack-api";

export const appDetailEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_APP_DETAIL),
    switchMap((action) => {
      console.log("need not call ", action);
      return fetchSkyAppDetails(action.payload.skyAppId).pipe(
        map((res) => (res.hasOwnProperty("status") ? res.result : res)),
        map((res) => {
          return fetchSkyspaceAppDetail({
            skyAppId: res.skhubId,
            session: action.payload.session,
          });
        })
      );
    })
  );

export const skyspaceAppDetailEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_SKYSPACE_APP_DETAIL),
    switchMap((action) => {
      return from(
        getSkylink(action.payload.session, action.payload.skyAppId)
      ).pipe(
        map((res) => {
          return fetchAppDetailSuccess({
            res,
            param: action.payload,
          });
        })
      );
    })
  );
