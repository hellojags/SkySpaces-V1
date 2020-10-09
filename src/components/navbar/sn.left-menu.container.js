import { bindActionCreators } from "redux";
import { setMobileMenuDisplay,
        toggleMobileMenuDisplay 
        } from "../../reducers/actions/sn.mobile-menu.action";
import { fetchSkyspaceList } from "../../reducers/actions/sn.skyspace-list.action";
import { toggleDesktopMenuDisplay } from "../../reducers/actions/sn.desktop-menu.action";

export function matchDispatcherToProps(dispatcher){
    return bindActionCreators({ 
        setMobileMenuDisplay,
        toggleMobileMenuDisplay,
        fetchSkyspaceList,
        toggleDesktopMenuDisplay
    }, dispatcher);
}

export function mapStateToProps(state) {
    return { 
        showMobileMenu: state.snShowMobileMenu,
        showDesktopMenu: state.snShowDesktopMenu,
        userSession: state.userSession,
        skyspaceList: state.snSkyspaceList,
        person: state.person
    };
}  
