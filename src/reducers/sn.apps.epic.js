import { ofType } from "redux-observable";
import { from } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { getAppList } from "../api/sn.api";
import {
  ACT_TY_FETCH_APPS,
  ACT_TY_FETCH_SKYSPACE_APPS,
  ACT_TY_FETCH_ALL_SKYLINKS,
  ACT_TY_FETCH_PUBLIC_APPS
} from "./actions/sn.action.constants";
import {
  fetchAppsSuccess,
  fetchSkyspaceAppsSuccess,
} from "./actions/sn.apps.action";
import { getSkyspaceApps, getAllSkylinks } from "../blockstack/blockstack-api";
import { getPublicApps } from "../skynet/sn.api.skynet";

export const appsEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_APPS),
    switchMap((action) =>
      getAppList(action.payload).pipe(
        map((res) => (res.hasOwnProperty("status") ? res.result : res)),
        map((res) => {
          return fetchAppsSuccess(res.rows);
        })
      )
    )
  );

export const publicAppsEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_PUBLIC_APPS),
    switchMap((action) => getPublicApps(action.payload)
        .then(res=>fetchAppsSuccess(res.data))
      )
  );

export const allSkylinksEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_ALL_SKYLINKS),
    switchMap((action) =>
      from(getAllSkylinks(action.payload)).pipe(
        map((res) => {
          // TODO: sorting logic
          return fetchAppsSuccess(res);
        })
      )
    )
  );

export const skyspaceAppsEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_SKYSPACE_APPS),
    switchMap((action) =>
      from(
        getSkyspaceApps(action.payload.session, action.payload.skyspace)
      ).pipe(
        map((res) => {
          console.log("response in skyspaceAppsepic", res);
          if (res == null) {
            res = [];
          } else {
            res
              .sort
              /* (skylink1, skylink2) =>
                new Date(skylink2.lastUpdateTS) -
                new Date(skylink1.lastUpdateTS) */
              ();
          }
          return fetchSkyspaceAppsSuccess(res);
        })
      )
    )
  );
