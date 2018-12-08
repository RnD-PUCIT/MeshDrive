import React, { Component } from "react";
import { ButtonGroup, Button } from "reactstrap";
import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import { connect } from "react-redux";
import fetchRootFiles, {
  shouldFetchFiles
} from "../../actions/files/fetchRootFiles";
import fetchFilesById, {
  shouldFetchFilesById
} from "../../actions/files/fetchFilesById";
import navigateTo from "../../actions/filenavigation/navigateTo";
import store from "../../store";
import "./style.css";

class FileNavigation extends Component {
  state = {
    currentFolder: null
  };
  componentDidMount() {
    const { historyStack } = this.props.fileNavigation;
    const currentFolder = historyStack[historyStack.length - 1];
    if (currentFolder) this.setState({ currentFolder });
  }
  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.fileNavigation) ===
      JSON.stringify(this.props.fileNavigation)
    )
      return;
    const { historyStack } = this.props.fileNavigation;
    const currentFolder = historyStack[historyStack.length - 1];
    this.setState({ currentFolder });
    console.log({ updated: currentFolder });
  }
  handleHomeClick = () => {
    const { drive } = this.state.currentFolder;
    this.props.fetchRootFiles(drive);
  };
  handleReloadClick = () => {
    const { drive, parent, listFilesAccount } = this.state.currentFolder;
    if (this.state.currentFolder.parent === "root") {
      this.props.fetchRootFiles(drive, true);
    } else {
      this.props.fetchFilesById(drive, listFilesAccount, parent, true);
    }
  };
  render() {
    const { historyStack } = this.props.fileNavigation;
    const { currentFolder = null } = this.state;
    const isHomeEnabled =
      currentFolder !== null && currentFolder.parent !== "root";
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
          <Button disabled={!isBackEnabled}>
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
  { fetchRootFiles, fetchFilesById, navigateTo }
)(FileNavigation);
