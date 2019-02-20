import React, { Component } from "react";
import {
  Button,
  Label,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import { connect } from "react-redux";

import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import { GOOGLEDRIVE, DROPBOX, ONEDRIVE } from "../../constants/strings";

class DriveAccountSelect extends Component {
  state = {
    drive: null,
    displayDriveAccounts: [],
    driveAccount: "",
    isDriveValid: false,
    isDriveAccountValid: false
  };

  handleDriveClick = drive => {
    const { driveAccountsList = [] } = this.props.user;
    let displayDriveAccounts;
    switch (drive) {
      case GOOGLEDRIVE:
        displayDriveAccounts = driveAccountsList.googleDriveAccountsList;
        break;
      case ONEDRIVE:
        displayDriveAccounts = driveAccountsList.oneDriveAccountsList;

        break;
      case DROPBOX:
        displayDriveAccounts = driveAccountsList.dropboxAccountsList;
        break;
    }

    this.setState(
      {
        drive,
        displayDriveAccounts,
        isDriveValid: true
      },
      () => {
        if (typeof this.props.onSelectValidDrive === "function") {
          this.props.onSelectValidDrive(drive);
        }
      }
    );
  };
  handleDriveAccountClick = email => {
    this.setState(
      {
        driveAccount: email,
        isDriveAccountValid: true
      },
      () => {
        if (typeof this.props.onSelectValidDriveAccount === "function") {
          this.props.onSelectValidDriveAccount(email);
        }
      }
    );
  };
  render() {
    const mapAccountsListToListGroupItem = this.state.displayDriveAccounts.map(
      email => (
        <ListGroupItem
          key={email}
          tag="button"
          action
          active={this.state.driveAccount === email}
          onClick={e => {
            e.preventDefault();
            this.handleDriveAccountClick(email);
          }}
        >
          {email}
        </ListGroupItem>
      )
    );

    return (
      <div>
        <Label className="d-block">Select Drive</Label>
        <ButtonGroup className="mt-2 mb-4">
          <Button
            color="danger"
            outline
            onClick={e => {
              e.preventDefault();
              this.handleDriveClick(GOOGLEDRIVE);
            }}
            active={this.state.drive === GOOGLEDRIVE}
          >
            <FAIcon icon="google" classes={["fab"]} /> Google Drive
          </Button>
          <Button
            color="primary"
            outline
            onClick={e => {
              e.preventDefault();
              this.handleDriveClick(DROPBOX);
            }}
            active={this.state.drive === DROPBOX}
          >
            <FAIcon icon="dropbox" classes={["fab"]} /> Dropbox
          </Button>
          <Button
            color="dark"
            outline
            onClick={e => {
              e.preventDefault();
              this.handleDriveClick(ONEDRIVE);
            }}
            active={this.state.drive === ONEDRIVE}
          >
            <FAIcon icon="cloud" classes={["fa"]} /> OneDrive
          </Button>
        </ButtonGroup>

        {this.state.drive !== null && (
          <Card>
            <CardHeader>Select your email account</CardHeader>
            <CardBody>
              <ListGroup>
                {mapAccountsListToListGroupItem.length
                  ? mapAccountsListToListGroupItem
                  : "No account exists"}
              </ListGroup>
            </CardBody>
          </Card>
        )}
      </div>
    );
  }
}

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps)(DriveAccountSelect);
