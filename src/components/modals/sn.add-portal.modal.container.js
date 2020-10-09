import { bindActionCreators } from "redux";
import { setMobileMenuDisplay,
        toggleMobileMenuDisplay
        } from "../../reducers/actions/sn.mobile-menu.action";
import { fetchBlockstackPerson,
    logoutPerson } from "../../reducers/actions/sn.person.action";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import { setPortalsListAction, fetchPortalsListAction } from "../../reducers/actions/sn.portals.action";

export function matchDispatcherToProps(dispatcher){
    return bindActionCreators({ 
        setMobileMenuDisplay,
        toggleMobileMenuDisplay,
        fetchBlockstackPerson,
        setLoaderDisplay,
        logoutPerson,
        setPortalsListAction,
        fetchPortalsListAction,
    }, dispatcher);
}

export function mapStateToProps(state) {
    return { showMobileMenu: state.snShowMobileMenu,
            userSession: state.userSession,
            person: state.person,
            snPortalsList: state.snPortalsList
        };
} 
