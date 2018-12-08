import React, { Component } from "react";
import { ButtonGroup, Button } from "reactstrap";
import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import { connect } from "react-redux";
import fetchRootFiles from "../../actions/files/fetchRootFiles";
import fetchFilesById from "../../actions/files/fetchFilesById";
import navigateTo from "../../actions/filenavigation/navigateTo";
import navigateToHome from "../../actions/filenavigation/navigateToHome";
import navigateToBack from "../../actions/filenavigation/navigateToBack";
import "./style.css";

class FileNavigation extends Component {
  handleHomeClick = () => {
    this.props.navigateToHome();
  };
  handleReloadClick = () => {
    const { currentIndex, historyStack } = this.props.fileNavigation;

    const { drive, parent, listFilesAccount } = historyStack[currentIndex];
    if (this.state.currentFolder.parent === "root") {
      this.props.fetchRootFiles(drive, true);
    } else {
      this.props.fetchFilesById(drive, listFilesAccount, parent, true);
    }
  };
  handleBack = () => {
    this.props.navigateToBack();
  };
  render() {
    const { currentIndex, historyStack } = this.props.fileNavigation;

    const currentFolder = currentIndex >= 0 ? historyStack[currentIndex] : null;
    const isHomeEnabled =
      currentFolder !== null &&
      currentFolder.parent !== "root" &&
      historyStack.length > 0;
    const isReloadEnabled = currentFolder !== null;
    const isUpOneLevelEnabled = false;
    const isBackEnabled = historyStack.length > 1;
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
          <Button onClick={this.handleBack} disabled={!isBackEnabled}>
            <FAIcon icon="arrow-left" classes={["fa"]} /> Back
          </Button>
          <Button disabled={!isForwardEnabled}>
            <FAIcon icon="arrow-right" classes={["fa"]} /> Forward
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button onClick={this.handleReloadClick} disabled={!isReloadEnabled}>
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
export default connect(
  mapStateToProps,
  { fetchRootFiles, fetchFilesById, navigateTo, navigateToBack, navigateToHome }
)(FileNavigation);
