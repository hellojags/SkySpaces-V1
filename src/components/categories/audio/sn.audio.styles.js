import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  spaceIcons: {
    color: theme.palette.primary.main,
    fontSize: 40,
    fontWeight: 400,
  },
  spaceName: {
    color: theme.palette.primary.main,
    fontWeight: 500,
  },
  createAtTime: {
    color: theme.palette.mediumGray,
    fontSize: 13,
  },
  status: {
    color: theme.palette.linksColor,
    fontWeight: "bold",
  },
  tagsBg: {
    width: 72,
    height: 29,
    borderRadius: 50,
    backgroundColor: theme.palette.lightGreen,
    color: "black",
    paddingLeft: 20,
    textAlign: "center",
    paddingRight: 20,
    paddingTop: 6,
    paddingBottom: 6,
    marginLeft: 15,
    fontSize: 13,
    marginBottom: 10,
  },
  tagEditIcon: {
    color: theme.palette.primary.main,
    fontSize: 18,
  },
  paperStyling: {
    padding: 15,
    // boxShadow: "0px 0px 5px 8px rgba(50, 50, 50, 0.14)",
    boxShadow: "0 0 10px rgba(0,0,0,.4)",
    borderRadius: "10px",
    backgroundColor:theme.palette.headerBgColor
  },
}));
