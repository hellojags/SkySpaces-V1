import { ACT_TY_CREATE_SKAPP } from "../reducers/actions/sn.action.constants";
import { ofType } from 'redux-observable';
import { switchMap, map } from 'rxjs/operators';
import { createSkapp } from "../api/sn.api";
import { createSkappSuccess } from "../reducers/actions/sn.app-detail.action";

export const createAppEpic = action$=> action$
    .pipe(
        ofType(ACT_TY_CREATE_SKAPP),
        switchMap((action)=>{
            console.log("create skapp switchmap ", action);
            return createSkapp(action.payload)
        .pipe(
            map(res => {
                console.log(res);
                const resObj = res.response;
                return (resObj.hasOwnProperty("status") ? resObj.result : resObj)
            }),
            map(res=>{
                return createSkappSuccess(res);
            })
        )}
    )
    );