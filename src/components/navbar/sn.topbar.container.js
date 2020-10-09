import { bindActionCreators } from "redux";
import { setMobileMenuDisplay,
        toggleMobileMenuDisplay
        } from "../../reducers/actions/sn.mobile-menu.action";
import { fetchBlockstackPerson,
    logoutPerson,setPerson,
    setPersonGetOtherData } from "../../reducers/actions/sn.person.action";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import { toggleDesktopMenuDisplay } from "../../reducers/actions/sn.desktop-menu.action";
import { fetchPublicApps, setApps } from "../../reducers/actions/sn.apps.action";
import {setUserSession } from "../../reducers/actions/sn.user-session.action"
import { fetchAppsSuccess } from "../../reducers/actions/sn.apps.action";

export function matchDispatcherToProps(dispatcher){
    return bindActionCreators({ 
        setMobileMenuDisplay,
        toggleMobileMenuDisplay,
        fetchBlockstackPerson,
        logoutPerson,
        toggleDesktopMenuDisplay,
        setUserSession,
        setPerson,
        setPersonGetOtherData,
        fetchPublicApps,
        setLoaderDisplay,
        fetchAppsSuccess,
        setApps
    }, dispatcher);
}

export function mapStateToProps(state) {
    return { showMobileMenu: state.snShowMobileMenu,
            userSession: state.userSession,
            snPortalsList: state.snPortalsList,
            snApps: state.snApps,
            person: state.person,
            triggerSignIn: state.snTriggerSignin,
            snUserSetting: state.snUserSetting,
            snTopbarDisplay: state.snTopbarDisplay,
            snShowDesktopMenu: state.snShowDesktopMenu,
            snPublicHash: state.snPublicHash,
            snPublicInMemory: state.snPublicInMemory
        };
} 
