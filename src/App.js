import React, { useEffect, useState } from "react";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import {
  faEnvelope,
  faFan,
  faLaughWink,
  faCloudUploadAlt,
  faStar,
  faVideo,
  faBlog,
  faWifi,
  faHeadphones,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import SnLoader from "./components/tools/sn.loader";
import SnRouter from "./router/sn.router";
import SnFooter from "./components/footer/sn.footer";
import { Connect } from '@blockstack/connect';
import { authOrigin, appDetails, userSession } from "./blockstack/constants";
import { createMuiTheme } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider } from "react-bootstrap";
library.add(
  faEnvelope,
  faFan,
  faLaughWink,
  faCloudUploadAlt,
  faStar,
  faVideo,
  faBlog,
  faWifi,
  faHeadphones,
  faEllipsisV
);

const authOptions = {
  redirectTo: '/',
  manifestPath: '/manifest.json',
  authOrigin,
  userSession,
  finished: ({ userSession }) => {
    console.log(userSession.loadUserData());
  },
  appDetails: appDetails,
};

// // Track when page is loaded
// const FathomTrack = () => {
//   useEffect(() => {
//     if (config.fathomSiteId) {
//       Fathom.load(config.fathomSiteId, {
//         url: config.fathomSiteUrl,
//       });
//       Fathom.trackPageview();
//     }
//   }, []);

//   return <React.Fragment />;
// };

// // Track on each page change
// Router.events.on('routeChangeComplete', () => {
//   Fathom.trackPageview();
// });

const App = () => {
  const [forLightGray, setforLightGray] = useState("#f7f7f7");
  const [forLinkColors, setForLinksColor] = useState("#656d70");
  const [whiteBgColorTheme, setwhiteBgColorTheme] = useState("#ffffff");
  const [activeDark, setActiveDark] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.log = function () { };
    }
  }, [])

  React.useEffect(() => {
    let getMode = localStorage.getItem("darkMode");
    if (getMode === "true") {
      setActiveDark(true);
    } else {
      setActiveDark(false);
    }
  }, [localStorage.getItem("darkMode")]);

  const handleDarkMode = (val) => {
    // console.log("called");
    setActiveDark(val);
  };

  const lightTheme = createMuiTheme({
    palette: {
      primary: {
        main: "#1ed660",
        textColor: "#636f70",
      },
      headerBgColor: "#ffffff",
      whiteBgColor: "#ffffff",
      linksColor: "#656d70",
      secondary: {
        main: "#636f70",
        textColor: "#c5c5c5",
      },
      sliderBg: "#ffffff",
      centerBar: "#ffffff",
      lightGray: "#f7f7f7",
      mediumGray: "#c5c5c5",
      lightGreen: "#daffe7",
      spacesTabsCount: "#EAEAEA",
    },
  });

  const darkTheme = createMuiTheme({
    palette: {
      primary: {
        main: "#1ed660",
        textColor: "#636f70",
      },
      sliderBg: "#141418",
      centerBar: "#343537",
      spacesTabsCount: "#000000",
      headerBgColor: "#1a1b1d",
      whiteBgColor: "#000000",
      linksColor: "#ffffff",
      secondary: {
        main: "#636f70",
        textColor: "#c5c5c5",
      },
      lightGray: "#1a1b1d",
      mediumGray: "#c5c5c5",
      lightGreen: "#daffe7",
    },
  });

  return (
    <MuiThemeProvider theme={activeDark ? darkTheme : lightTheme}>
      <SnLoader />
      <div>
        <SnRouter handleDarkMode={handleDarkMode} />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
