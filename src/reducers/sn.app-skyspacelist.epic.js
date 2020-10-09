import {
  ACT_TY_FETCH_APP_SKYSPACES,
  ACT_TY_FETCH_APP_SKYSPACES_AND_SKYSPACE_APP,
} from "../reducers/actions/sn.action.constants";
import { ofType } from "redux-observable";
import { switchMap, map } from "rxjs/operators";
import { from } from "rxjs";
import {
  fetchAppSkyspacesSuccess,
  fetchAppSkyspacesAndSkyspaceAppSuccess,
} from "../reducers/actions/sn.app-skyspacelist.action";
import { bsGetSkyspaceNamesforSkhubId } from "../blockstack/blockstack-api";

export const snAppSkyspacelistEpic = (action$) =>
  action$.pipe(
    ofType(
      ACT_TY_FETCH_APP_SKYSPACES,
      ACT_TY_FETCH_APP_SKYSPACES_AND_SKYSPACE_APP
    ),
    switchMap((action) => {
      console.log("in appskyspacelist epic to call", action);
      return from(
        bsGetSkyspaceNamesforSkhubId(
          action.payload.session,
          action.payload.skyAppId
        )
      ).pipe(
        map((res) => {
          if (action.type === ACT_TY_FETCH_APP_SKYSPACES) {
            return fetchAppSkyspacesSuccess(res);
          } else if (
            action.type === ACT_TY_FETCH_APP_SKYSPACES_AND_SKYSPACE_APP
          ) {
            return fetchAppSkyspacesAndSkyspaceAppSuccess(res, action.payload);
          }
        })
      );
    })
  );
