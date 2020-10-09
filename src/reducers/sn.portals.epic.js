import { ACT_TY_FETCH_PORTALS_LIST } from "../reducers/actions/sn.action.constants";
import { ofType } from "redux-observable";
import { switchMap, map } from "rxjs/operators";
import { from } from "rxjs";
import { setPortalsListAction } from "../reducers/actions/sn.portals.action";
import { setLoaderDisplay } from "../reducers/actions/sn.loader.action";
import { bsGetPortalsList } from "../blockstack/blockstack-api";

export const snPortalsListEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_PORTALS_LIST),
    switchMap((action) => {
      setLoaderDisplay(true);
      return from(bsGetPortalsList(action.payload)).pipe(
        map((res) => {
          setLoaderDisplay(false);
          return setPortalsListAction(res);
        })
      );
    })
  );
