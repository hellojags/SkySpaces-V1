import React from "react";
import { connect } from "react-redux";
import {
  mapStateToProps,
  matchDispatcherToProps,
} from "./sn.skyspace-cards.container";

class SnSkyspaceCards extends React.Component {
  fetchSkySpaceApps() {}

  componentDidMount() {
    const { skyspace } = this.props.match.params;
    console.log("sncards component mounted with skyspace", skyspace);
    console.log("will fetch skyspace apps nnow ", skyspace);
    //this.fetchSkySpaceApps(skyspace);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { skyspace } = this.props.match.params;
    console.log("sncards component updated with skyspace", skyspace);
    console.log("from did update ", skyspace);
  }

  render() {
    return (
      <>
        DUmmy
        {/* <SnCards /> */}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  matchDispatcherToProps
)(SnSkyspaceCards);
