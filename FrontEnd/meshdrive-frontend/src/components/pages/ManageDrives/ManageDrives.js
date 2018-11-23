// module imports
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { ButtonGroup, Button, Table } from "reactstrap";
// custom module imports
import Page from "../Page";
import SideBar from "../../Layout/SideBar/SideBar";
import requireAuth from "../../../hoc/requireAuth";
import addDrive from "../../../actions/user/addDrive";
import saveUserObjToLocalStorage from "../../../utils/saveUserObjToLocalStorage";
import FontAwesomeIcon from "../../FontAwesomeIcon/FontAwesomeIcon";
class ManageDrives extends Page {
  constructor(props) {
    super(props);

    const { driveAccountsList } = this.props.user;

    const {
      googleDriveAccountsList = [],
      dropBoxAccountsList = [],
      oneDriveAccountsList = []
    } = driveAccountsList;

    this.state = {
      driveAccountsList: googleDriveAccountsList.concat(
        dropBoxAccountsList.concat(oneDriveAccountsList)
      )
    };
  }

  handleGoogleDriveClick = e => {
    e.preventDefault();

    const { token } = this.props.user;

    this.props.addDrive(token, "GOOGLEDRIVE");
  };

  render() {
    const addDriveAction = this.props.addDrive;
    const userObj = this.props.user;
    let i = 1;
    const mapGoogleAccountsToTr = this.state.driveAccountsList.map(account => (
      <tr key={account}>
        <th scope="row">{i++}</th>
        <td>{account}</td>
        <td>Google</td>
        <td>
          <Button outline>
            <FontAwesomeIcon icon="times" classes={["fas"]} />
          </Button>
        </td>
      </tr>
    ));

    return (
      <React.Fragment>
        <SideBar primary />
        <div
          id="ManageDrives"
          className="flex-grow-1 d-flex flex-column pl-4 pr-4"
        >
          <h1>Manage Drives</h1>
          <Router>
            <Switch>
              <Route
                path="/managedrives/added/:email"
                exact
                render={() => {
                  const { email } = this.props.match.params;
                  const { token } = this.props.user;
                  addDriveAction(token, "GOOGLEDRIVE", email);
                  saveUserObjToLocalStorage(userObj);
                  return <div>Added</div>;
                }}
              />
              <Route
                path="/managedrives/failed"
                render={() => <div>Failed</div>}
              />
            </Switch>
          </Router>
          <ButtonGroup className="mt-2 mb-4">
            <Button
              color="danger"
              outline
              onClick={this.handleGoogleDriveClick}
            >
              Add Google Drive
            </Button>
            <Button color="primary" outline>
              Add DropBox
            </Button>
            <Button color="dark" outline>
              Add OneDrive
            </Button>
          </ButtonGroup>
          <h3>Drive Accounts</h3>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Account Email</th>
                <th>Drive</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>{mapGoogleAccountsToTr}</tbody>
          </Table>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps({ user }) {
  return {
    user
  };
}
export default connect(
  mapStateToProps,
  { addDrive }
)(requireAuth(ManageDrives));
