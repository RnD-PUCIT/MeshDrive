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

    const onConfirm = this.props.onConfirm
      ? this.props.onConfirm
      : this.hideAlert;

    const title = this.props.title ? this.props.title : "";

    if (this.props.primary) {
      return (
        <SweetAlert primary title={title} onConfirm={onConfirm}>
          {this.props.children}
        </SweetAlert>
      );
    } else if (this.props.info) {
      return (
        <SweetAlert info title={title} onConfirm={onConfirm}>
          {this.props.children}
        </SweetAlert>
      );
    } else if (this.props.success) {
      return (
        <SweetAlert success title={title} onConfirm={onConfirm}>
          {this.props.children}
        </SweetAlert>
      );
    } else if (this.props.warning) {
      return (
        <SweetAlert warning title={title} onConfirm={onConfirm}>
          {this.props.children}
        </SweetAlert>
      );
    } else if (this.props.danger) {
      return (
        <SweetAlert danger title={title} onConfirm={onConfirm}>
          {this.props.children}
        </SweetAlert>
      );
    } else {
      return (
        <SweetAlert title={title} onConfirm={onConfirm}>
          {this.props.children}
        </SweetAlert>
      );
    }
  }
}
