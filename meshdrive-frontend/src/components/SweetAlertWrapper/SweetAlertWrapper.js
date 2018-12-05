import React, { Component } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
export default class SweetAlertWrapper extends Component {
  state = {
    hideAlert: false
  };

  hideAlert = () => {
    this.setState({ hideAlert: true });
  };

  render() {
    if (this.state.hideAlert) return null;

    // default
    const onConfirm = this.hideAlert;
    const title = "";

    return (
      <SweetAlert title={title} onConfirm={onConfirm} {...this.props}>
        {this.props.children}
      </SweetAlert>
    );
  }
}
