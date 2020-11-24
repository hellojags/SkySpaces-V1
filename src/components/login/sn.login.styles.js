import { makeStyles } from "@material-ui/core/styles";
import { BorderBottom } from "@material-ui/icons";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  most_main_grid_auth: {
    padding: "60px 0px 0px 0px",
    width: "100%",
    margin: "0px",
  },
  main_grid_auth: {
    margin: "auto",
  },
  MaintabsPaper: {
    padding: "0px",
    // boxShadow: "0px 0px 5px 8px rgba(50, 50, 50, 0.14)",
    boxShadow: "0 0 10px rgba(0,0,0,.4)",
  },
  tabsPaper: {
    padding: "0px",
    boxShadow: "none",
  },
  margin: {
    margin: theme.spacing(1),
  },
  mail_textfield: {
    border: `3px solid ${theme.palette.mediumGray}`,
    marginTop: "40px",
    BorderBottom: "none",
    padding: "2px 10px",
    borderRadius: "8px",
    width: "63%",
  },
  underline: {
    "&&&:before": {
      borderBottom: "none",
    },
    "&&:after": {
      borderBottom: "none",
    },
  },

  password_textfield: {
    border: `3px solid ${theme.palette.mediumGray}`,
    BorderBottom: "none",
    padding: "3px 10px",
    borderRadius: "8px",
    width: "63%",
  },
  butn_tab1: {
    width: "50%",
    fontWeight: "700",
    fontFamily: "Arial, Helvetica, sans-serif",
    padding: "20px 0px",
    "&:focus": {
      outline: "none",
    },
  },
  txt_span_frgt_pass: {
    fontSize: "12px",
    position: "relative",
    left: "82px",
    bottom: "8px",
    fontWeight: "500",
    color: `${theme.palette.primary.main}`,
  },
  butn_login: {
    width: "100%",
    background: `${theme.palette.primary.main}`,
    color: "white",
    fontWeight: "600",
    marginTop: "20px",
    marginBottom: "40px",
    "&&&:focus": {
      outline: "none",
    },
  },
  description_auth: {
    paddingTop: "35px !important",
    color: `darkgray`,
    margin: "auto",
    textAlign: "center",
    fontSize: "13px",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
});

export default styles;