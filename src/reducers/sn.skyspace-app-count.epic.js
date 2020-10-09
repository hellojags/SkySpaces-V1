import { ACT_TY_FETCH_SKYSPACE_APP_COUNT } from "../reducers/actions/sn.action.constants";
import { ofType } from "redux-observable";
import { switchMap, map } from "rxjs/operators";
import { from } from "rxjs";
import { setSkyspaceAppCount } from "../reducers/actions/sn.skyspace-app-count.action";
import { bsGetSkyspaceAppCount } from "../blockstack/blockstack-api";

export const snSkyspaceAppCountEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_SKYSPACE_APP_COUNT),
    switchMap((action) => {
      return from(bsGetSkyspaceAppCount(action.payload)).pipe(
        map((res) => {
          return setSkyspaceAppCount(res);
        })
      );
    })
  );
