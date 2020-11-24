import { makeStyles } from "@material-ui/core/styles";

const leftMenuStyles = (theme) => ({
    dashboardCont: {
        display: "flex",
        flexDirection: "row",
        marginLeft: 28,
        marginTop: 25,
        alignItems: "center",
    },
    spaceIcon: {
        color: theme.palette.primary.main,
        fontSize: "20px",
        cursor: "pointer"
    },
    spacesLink: {
        color: theme.palette.primary.main,
        paddingLeft: 30,
    },
    iconStyling: {
        fontSize: "20px",
    },
    spacesCont: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: 10,
        paddingBottom: 10,
    },
    linkName: {
        paddingLeft: 30,
        color: theme.palette.linksColor,
        textDecoration: "none",
    },
    spacelinkName: {
        paddingLeft: 30,
        fontSize: 15,
        color: theme.palette.linksColor,
    },
    editIconStyle: {
        fontSize: 23,
        paddingRight: 5,
        color: theme.palette.mediumGray,
    },
    shareIconStyle: {
        fontSize: 15,
        color: theme.palette.mediumGray,
        cursor: "pointer"
    },
    list: {
        width: 295,
    },
    fullList: {
        width: "auto",
    },
    spaceBookIcon: {
        fontSize: 15,
        color: theme.palette.mediumGray,
        position: "relative",
        left: 12,
    },
    spacesNumber: {
        color: theme.palette.primary.main,
        fontSize: 13,
        paddingLeft: 6,
    },
    spaceLinkStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: theme.palette.linksColor,
        paddingTop: 10,
        paddingBottom: 10,
    },
    linksStyles: {
        display: "flex",
        alignItems: "center",
        color: theme.palette.linksColor,
        paddingTop: 10,
        paddingBottom: 10,
    },
    sideNavContainer: {
        paddingTop: 100,
        margin: "auto",
        width: "80%",
    },
    sideNavContainerForDrawer: {
        paddingTop: 20,
        margin: "auto",
        width: "80%",
    },
    drawerPaper: {
        width: 295,
        borderRight: "none",
        backgroundColor: theme.palette.lightGray,
    },
    content: {
        [theme.breakpoints.up("sm")]: {
            width: `calc(100% - ${295}px)`,
            marginLeft: 295,
        },
        backgroundColor: theme.palette.whiteBgColor,
        padding: theme.spacing(3),
    },
    content2: {
        [theme.breakpoints.up("sm")]: {
            width: "100%",
            marginLeft: 0,
        },
    },
    drawer: {
        [theme.breakpoints.up("sm")]: {
            width: 295,
            flexShrink: 0,
        },
    },
    sideProf_div: {
        marginTop: "20px",
        height: "120px",
        background: "white",
        overflowY: "scroll",
        paddingBottom: "20px",
    },
    innerSideProf_div: {
        display: "flex",
        padding: "20px",
    },
    innerSideProf2_div: {
        display: "flex",
        padding: "0px 20px 0px 20px",
    },
    icon_sub_title_div: {
        fontSize: "11px",
        padding: "3px 0px 0px 20px",
        color: `${theme.palette.primary.textColor}`,
    },
    image_logo_sideBarfooter: {
        display: "flex",
        justifyContent: "center",
    },
});


export default leftMenuStyles;