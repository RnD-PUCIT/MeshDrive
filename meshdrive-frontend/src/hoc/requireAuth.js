import React, { Component } from "react";
import { connect } from "react-redux";

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() {
      this.navigateIfLoggedOut();
    }
    
    componentDidUpdate(prevProps) {
      const prevUserStringify = JSON.stringify(prevProps.user);
      const userStringify = JSON.stringify(this.props.user);

      if (prevUserStringify === userStringify) return;
      this.navigateIfLoggedOut();
    }

    navigateIfLoggedOut() {
      const { token } = this.props.user;
      debugger;
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
