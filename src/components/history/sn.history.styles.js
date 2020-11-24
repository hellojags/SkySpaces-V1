import { makeStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    content: {
        [theme.breakpoints.up("sm")]: {
            width: `calc(100% - ${295}px)`,
            marginLeft: 295,
        },
        backgroundColor: theme.palette.whiteBgColor,
        padding: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    most_main_grid_actvHstry: {
        padding: "0px",
        width: "100%",
        margin: 0,
    },
    main_grid_actvHstry: {
        margin: "auto",
    },
    MaintabsPaper_actvHstry: {
        paddingTop: "10px",
        // paddingLeft: "35px",
        paddingRight: "35px",
        paddingBottom: "40px",
        // boxShadow: "5px 5px 9px 5px #E6E6E6",
        boxShadow: "none",
        backgroundColor: theme.palette.whiteBgColor,
    },
    tabsPaper_actvHstry: {
        padding: "0px",
        boxShadow: "none",
        backgroundColor: theme.palette.whiteBgColor,
    },
    actvHstry_title: {
        color: theme.palette.linksColor,
        textAlign: "left",
        fontWeight: "500",
        fontSize: "20px",
        paddingBottom: "30px",
    },
    search_main_div: {
        display: "flex",
    },
    srch_inpt: {
        paddingLeft: "40px",
        backgroundColor: theme.palette.headerBgColor,
        "&&&:focus": {
            borderColor: "none",
            boxShadow: "none",
        },
    },
});

export default styles;
