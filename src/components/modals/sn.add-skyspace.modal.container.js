import { bindActionCreators } from "redux";
import { setMobileMenuDisplay,
        toggleMobileMenuDisplay
        } from "../../reducers/actions/sn.mobile-menu.action";
import { fetchBlockstackPerson,
    logoutPerson } from "../../reducers/actions/sn.person.action";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import { setSkyspaceList, fetchSkyspaceList } from "../../reducers/actions/sn.skyspace-list.action";
import { fetchSkyspaceDetail } from "../../reducers/actions/sn.skyspace-detail.action";


export function matchDispatcherToProps(dispatcher){
    return bindActionCreators({ 
        setMobileMenuDisplay,
        toggleMobileMenuDisplay,
        fetchBlockstackPerson,
        setLoaderDisplay,
        logoutPerson,
        setSkyspaceList,
        fetchSkyspaceList,
        fetchSkyspaceDetail
    }, dispatcher);
}

export function mapStateToProps(state) {
    return { showMobileMenu: state.snShowMobileMenu,
            userSession: state.userSession,
            person: state.person,
            skyspaceList: state.snSkyspaceList
        };
} 
