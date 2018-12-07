import React, { Component } from "react";
import { ButtonGroup, Button } from "reactstrap";
import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import { connect } from "react-redux";
import { shouldFetchFiles } from "../../actions/files/fetchRootFiles";
import navigateTo from "../../actions/filenavigation/navigateTo";
import store from "../../store";
import "./style.css";

class FileNavigation extends Component {
  state = {
    current: null
  };

  componentDidUpdate(prevProps) {
    if (prevProps.fileNavigation === this.props.fileNavigation) return;
    const { historyStake } = this.props.fileNavigation;
    const top = historyStake[historyStake.length - 1];
    console.log({ top: top.parent });
    debugger;
    this.setState({ current: top });
  }
  handleHomeClick = () => {
    const { historyStake } = this.props.fileNavigation;
    const root = historyStake[0];
    store.dispatch(shouldFetchFiles(store.getState(), root.items));
    navigateTo
  };
  render() {
    const isHomeEnabled =
      this.state.current !== null && this.state.current.parent !== "root";
    const isUpOneLevelEnabled =
      this.state.current !== null && this.state.current.length > 1;

    const isBackEnabled = false;
    const isForwardEnabled = false;
    return (
      <div id="FileNavigation" className="file-navigation-bar">
        <ButtonGroup>
          <Button disabled={!isHomeEnabled} onClick={this.handleHomeClick}>
            <FAIcon icon="home" classes={["fa"]} /> Home
          </Button>
          <Button disabled={!isUpOneLevelEnabled}>
            <FAIcon icon="arrow-up" classes={["fa"]} /> Up One Level
          </Button>
          <Button disabled={!isBackEnabled}>
            <FAIcon icon="arrow-left" classes={["fa"]} /> Back
          </Button>
          <Button disabled={!isForwardEnabled}>
            <FAIcon icon="arrow-right" classes={["fa"]} /> Forward
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button>
            <FAIcon icon="sync-alt" classes={["fa"]} /> Reload
          </Button>
          <Button>
            <FAIcon icon="check-square" classes={["fas"]} /> Select All
          </Button>
          <Button>
            <FAIcon icon="check-square" classes={["far"]} /> Unselect All
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}
function mapStateToProps({ fileNavigation }) {
  return { fileNavigation };
}
export default connect(mapStateToProps)(FileNavigation);
