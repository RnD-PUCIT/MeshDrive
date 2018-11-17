import React, { Component } from "react";
import { connect } from "react-redux";
import { localStorageTokenString } from "../constants/strings";

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() {
      this.navigateIfLoggedOut();
    }
    componentDidUpdate() {
      this.navigateIfLoggedOut();
    }

    navigateIfLoggedOut() {
      if (!this.props.auth.token) {
        this.props.history.push("/");
      }
    }

    render() {
      return <ChildComponent {...this.props} />;
    }
  }
  function mapStateToProps({ auth }) {
    return {
      auth
    };
  }
  return connect(mapStateToProps)(ComposedComponent);
};
