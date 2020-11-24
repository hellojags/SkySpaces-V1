import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appsIcon: {
    color: theme.palette.linksColor,
  },
  reOrdered: {
    color: theme.palette.linksColor,
  },
  lowPriorIcon: {
    color: theme.palette.linksColor,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  input: {
    display: "none",
  },
  sharedSpaceButn: {
    color: "white",
    borderRadius: 10,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginRight: 20,
  },
  icon: {
    color: theme.palette.primary.main,
  },
  menuColor: {
    color: theme.palette.linksColor,
  },
  sharedSpaceButn: {
    color: "white",
    borderRadius: 10,
  },
  most_main_grid_gallery: {
    padding: "0px",
    width: "100%",
    margin: 0,
  },
  main_grid_gallery: {
    margin: "auto",
  },
  MaintabsPaper_gallery: {
    paddingTop: "10px",
    // paddingLeft: "35px",
    paddingRight: "35px",
    paddingBottom: "40px",
    // boxShadow: "5px 5px 9px 5px #E6E6E6",
    boxShadow: "none",
    backgroundColor: theme.palette.whiteBgColor,
  },
  tabsPaper_gallery: {
    padding: "0px",
    boxShadow: "none",
    backgroundColor: theme.palette.whiteBgColor,
  },
  gallery_title: {
    color: theme.palette.linksColor,
    textAlign: "left",
    fontWeight: "500",
    fontSize: "20px",
  },
  gallery_subTitle: {
    color: theme.palette.primary.main,
    textAlign: "left",
    fontSize: "14px",
  },
  image_grid_gallery: {
    padding: "2px !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  gallery_title_btns_grid: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  gallery_title_head_Alltext: {
    background: `${theme.palette.lightGray}`,
    padding: "5px 15px",
    borderRadius: "5px",
    color: `${theme.palette.primary.textColor}`,
    fontSize: "13px",
  },
  gallery_title_head_Alltext_menu: {
    background: `${theme.palette.lightGray}`,
    padding: "15px 50px",
    borderRadius: "5px",
    color: `${theme.palette.primary.textColor}`,
    fontSize: "13px",
  },
  innerValue_All: {
    background: theme.palette.spacesTabsCount,
    borderRadius: "100%",
    marginLeft: "7px",
    fontSize: "11px",
    padding: "3px",
    display: "inline-block",
    width: "25px",
    color: `${theme.palette.primary.main}`,
    textAlign: "center",
    // paddingRight: "3px",
  },
  gallery_title_head_image_text: {
    background: `${theme.palette.lightGray}`,
    padding: "5px 15px",
    borderRadius: "5px",
    color: `${theme.palette.primary.textColor}`,
    fontSize: "13px",
    marginLeft: "15px",
    // "&:focus": {
    //   background: `${theme.palette.lightGreen}`,
    // },
  },
  menuverticalIcon_div: {
    background: `${theme.palette.lightGray}`,
    padding: "3px",
    borderRadius: "100%",
    marginLeft: "10px",
  },
  inner_image_icons: {
    // display: "none",
    position: "absolute",
    color: "white",
    paddingBottom: "10px",
  },
  titleBar_onSelect_img_grid_gallery: {
    marginBottom: "20px",
    background: `${theme.palette.lightGray}`,
  },
}));
