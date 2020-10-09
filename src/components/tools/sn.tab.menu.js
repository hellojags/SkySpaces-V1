import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    "aria-controls": `action-tabpanel-${index}`,
  };
}

export default function SnTabMenu(props) {
  return (
    <AppBar position="static" color="default">
      <Tabs
        value={props.value}
        name={props.name}
        onChange={(evt, index) => props.onTabChange(evt, index)}
        indicatorColor={props.indicatorColor ? props.indicatorColor : "primary"}
        textColor={props.textColor ? props.textColor : "primary"}
        variant={props.variant ? props.variant : "fullWidth"}
        aria-label="action tabs example">
        {Object.keys(props.tablist).map((key) => {
          return (
            <Tab
              key={key}
              label={props.tablist[key].label}
              {...a11yProps(key)}
            />
          );
        })}
      </Tabs>
    </AppBar>
  );
}
