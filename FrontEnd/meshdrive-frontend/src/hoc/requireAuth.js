import React, { Component } from "react";
import { connect } from "react-redux";
import { localStorageUserObjString } from "../constants/strings";

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() {
      // this.navigateIfLoggedOut();
    }
    componentDidUpdate() {
      this.navigateIfLoggedOut();
    }

    navigateIfLoggedOut() {
      const { token } = this.props.user;
      // console.log(token);
      if (token === null || token === undefined) {
        this.props.history.push("/");
      }
    }

    render() {
      return <ChildComponent {...this.props} />;
    }
  }
  function mapStateToProps({ user }) {
    return {
      user
    };
  }
  return connect(mapStateToProps)(ComposedComponent);
};
