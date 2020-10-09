import {
  ACT_TY_FETCH_BLOCKSTACK_USER,
  ACT_TY_LOGOUT_BLOCKSTACK_USER,
} from "../reducers/actions/sn.action.constants";
import { ofType } from "redux-observable";
import { switchMap, map } from "rxjs/operators";
import { from } from "rxjs";
import {
  setPersonGetOtherData,
  setPerson,
} from "../reducers/actions/sn.person.action";
import { fetchSkyspaceList } from "../reducers/actions/sn.skyspace-list.action";
import { bsSavePublicKey } from "../blockstack/blockstack-api";

export const snPersonEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_FETCH_BLOCKSTACK_USER),
    switchMap((action) => {
      return from(action.payload.handlePendingSignIn()).pipe(
        map((res) => {
          bsSavePublicKey(action.payload);
          fetchSkyspaceList(action.payload);
          return setPersonGetOtherData(res);
        })
      );
    })
  );

export const logoutPersonEpic = (action$) =>
  action$.pipe(
    ofType(ACT_TY_LOGOUT_BLOCKSTACK_USER),
    switchMap((action) => {
      return from(action.payload.signUserOut(window.location.origin)).pipe(
        map((res) => {
          return setPerson(null);
        })
      );
    })
  );
