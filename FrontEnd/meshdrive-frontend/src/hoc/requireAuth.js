import React, { Component } from "react";

export default ChildComponent => {
  class requireAuth extends Component {
    componentDidMount() {
      this.shouldNavigateAway();
    }
    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    shouldNavigateAway() {
      if (this.props.auth) {
        this.props.history.push("/");
      }
    }

    render() {
      return <ChildComponent {...this.props} />;
    }

    mapStateToProps(state) {
      return {
        user: state.user
      };
    }
  }
};
