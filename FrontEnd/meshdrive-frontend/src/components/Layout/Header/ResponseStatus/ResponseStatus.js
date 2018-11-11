import React, { Component } from "react";
import { connect } from "react-redux";

import { Alert } from "reactstrap";
import "./style.css";

class ResponseStatus extends Component {
  render() {
    const { showUi, apiResponse, started, inProgress } = this.props.api;
    if (!showUi && !started) return null;

    console.log(apiResponse);

    let status = false;
    if (apiResponse) status = apiResponse.status;

    const finished = started && !inProgress;
    let statusComponent;

    if (started && inProgress) {
      statusComponent = (
        <div className="bar">
          <span />
        </div>
      );
    } else if (finished) {
      statusComponent = this.props.api.responseUiComponent
        ? this.props.api.responseUiComponent
        : null;
    }

    return <div id="ResponseStatus">{statusComponent}</div>;
  }
}

function mapStateToProps(state) {
  return {
    api: state.api
  };
}

export default connect(
  mapStateToProps,
  null
)(ResponseStatus);
