import React, { Component } from "react";
import { ButtonGroup, Button } from "reactstrap";
import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import "./style.css";
export default class FileNavigation extends Component {
  render() {
    return (
      <div id="FileNavigation" className="file-navigation-bar">
        <ButtonGroup>
          <Button>
            <FAIcon icon="home" classes={["fa"]} /> Home
          </Button>
          <Button>
            <FAIcon icon="arrow-up" classes={["fa"]} /> Up One Level
          </Button>
          <Button>
            <FAIcon icon="arrow-left" classes={["fa"]} /> Back
          </Button>
          <Button>
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
