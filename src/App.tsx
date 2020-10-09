import React from "react";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";

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
import {authOrigin, appDetails,userSession} from "./blockstack/constants";
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
  finished: ({ userSession }: { userSession: any }) => {
    console.log(userSession.loadUserData());
  },
  appDetails:appDetails,
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

class App extends React.Component {
  constructor(props: any){
    super(props);
    if (process.env.NODE_ENV==='production'){
      console.log = function () {};
    }
  }

  render() {

    return (
      <React.Fragment >
        <Connect authOptions={authOptions}>
          <SnLoader />
          <SnRouter />
          <SnFooter />
        </Connect>
      </React.Fragment>
    );
  }
}

export default App;
