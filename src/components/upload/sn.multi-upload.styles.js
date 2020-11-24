import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
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
  formControl : {
    width: "100%"
  },
  most_main_grid_uc: {
    padding: "60px 0px 0px 0px",
    width: "100%",
    margin: 0,
  },
  main_grid_uc: {
    margin: "auto",
  },
  MaintabsPaper_uc: {
    paddingTop: "25px",
    // paddingLeft: "35px",
    paddingRight: "35px",
    paddingBottom: "40px",
    // boxShadow: "0px 0px 5px 8px rgba(50, 50, 50, 0.14)",
    boxShadow: "0 0 10px rgba(0,0,0,.4)",

    borderRadius: "10px",
  },
  tabsPaper_uc: {
    padding: "0px",
    boxShadow: "none",
  },
  uc_title: {
    color: theme.palette.primary.textColor,
    textAlign: "left",
    fontSize: "17px",
    fontWeight: "500",
  },
  tags_inpt_main_grid: {
    padding: "20px 0px",
  },
  // dropzone_image_uc_form: {
  //   border: `3px dashed ${theme.palette.secondary.textColor}`,
  // },
  show_img_title_grid: {
    width: "100%",
    marginTop: "25px",
    marginLeft: "15px",
    marginRight: "15px",
    padding: "3px 10px !important",
    borderRadius: "5px",
    display: "flex",
    border: `1px solid ${theme.palette.secondary.textColor}`,
  },
  descIcon: {
    color: theme.palette.primary.main,
    fontSize: "18px",
    position: "relative",
    bottom: "2px",
    marginRight: "10px",
  },
  img_name_txt: {
    fontSize: "12px",
    color: theme.palette.secondary.textColor,
    position: "relative",
    top: "3px",
  },
}));
