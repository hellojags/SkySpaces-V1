import { ACT_TY_FETCH_SKYSPACE_LIST } from "../reducers/actions/sn.action.constants";
import { ofType } from "redux-observable";
import { switchMap, map } from "rxjs/operators";
import { from } from "rxjs";
import { setSkyspaceList } from "../reducers/actions/sn.skyspace-list.action";
import { setLoaderDisplay } from "../reducers/actions/sn.loader.action";
import { bsGetAllSkySpaceNames } from "../blockstack/blockstack-api";

export const snSetSkypaceListEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_SKYSPACE_LIST),
    switchMap((action) => {
      setLoaderDisplay(true);
      return from(bsGetAllSkySpaceNames(action.payload)).pipe(
        map((res) => {
          setLoaderDisplay(false);
          return setSkyspaceList(res);
        })
      );
    })
  );
