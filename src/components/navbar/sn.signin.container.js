import { bindActionCreators } from "redux";
import { setMobileMenuDisplay,
        toggleMobileMenuDisplay
        } from "../../reducers/actions/sn.mobile-menu.action";
import { fetchBlockstackPerson,
    logoutPerson } from "../../reducers/actions/sn.person.action";


export function matchDispatcherToProps(dispatcher){
    return bindActionCreators({ 
        setMobileMenuDisplay,
        toggleMobileMenuDisplay,
        fetchBlockstackPerson,
        logoutPerson
    }, dispatcher);
}

export function mapStateToProps(state) {
    return { showMobileMenu: state.snShowMobileMenu,
            userSession: state.userSession,
            person: state.person,
            triggerSignIn: state.snTriggerSignin
        };
} 
