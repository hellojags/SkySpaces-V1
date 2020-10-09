import { ACT_TY_TRIGGER_SIGNIN } from "../reducers/actions/sn.action.constants";

export const setTriggerSignin = (triggerSignIn) => {
    return {
        type: ACT_TY_TRIGGER_SIGNIN,
        payload: triggerSignIn
    };
}