import { ACTY_TY_FETCH_HISTORY } from "../reducers/actions/sn.action.constants";
import { ofType } from "redux-observable";
import { switchMap, map } from "rxjs/operators";
import { from } from "rxjs";
import { getUserHistory } from "../blockstack/blockstack-api";
import { fetchHistorySuccess } from "../reducers/actions/sn.history.action";

export const fetchHistoryEpic = (action$) =>
  action$.pipe(
    ofType(ACTY_TY_FETCH_HISTORY),
    switchMap((action) => {
      return from(getUserHistory(action.payload)).pipe(
        map((res) => {
          return fetchHistorySuccess(res.sort((obj1, obj2) =>
          new Date(obj2.lastUpdateTS) -
          new Date(obj1.lastUpdateTS)));
        })
      );
    })
  );
