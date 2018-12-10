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
import fetchDriveAccountsList from "../../../actions/user/fetchDriveAccountsList";
import requestRemoveGoogleAccountByEmail from "../../../actions/user/requestRemoveGoogleAccountByEmail";
import requestRemoveAllGoogleDriveAccounts from "../../../actions/user/requestRemoveAllGoogleDriveAccounts";
import FontAwesomeIcon from "../../FontAwesomeIcon/FontAwesomeIcon";
class ManageDrives extends Page {
  state = {
    driveAccountsList: []
  };
  handleGoogleDriveClick = e => {
    e.preventDefault();

    const { token } = this.props.user;

    this.props.addDrive(token, "GOOGLEDRIVE");
  };
  handleDropboxClick = e => {
    e.preventDefault();
     const { token } = this.props.user;
     this.props.addDrive(token, "DROPBOX");
  };
  handleRemoveAllAccounts = e => {
    e.preventDefault();

    this.props.requestRemoveAllGoogleDriveAccounts();
  };
  render() {
    const { driveAccountsList = {} } = this.props.user;
    const {
      googleDriveAccountsList = [],
      dropboxAccountsList = [],
      oneDriveAccountsList = []
    } = driveAccountsList;
    console.log("DRIVES"+ driveAccountsList);
    let i = 1;
    const mapGoogleAccountsToTr = googleDriveAccountsList
      .map(account => (
        <tr key={account}>
          <th scope="row">{i++}</th>
          <td>{account}</td>
          <td>Google</td>
          <td>
            <Button
              outline
              onClick={() => {
                this.props.requestRemoveGoogleAccountByEmail(account);
              }}
            >
              <FontAwesomeIcon icon="times" classes={["fas"]} />
            </Button>
          </td>
        </tr>
      ));

      const mapDropboxAccountsToTr = dropboxAccountsList
      .map(account => (
        <tr key={account}>
          <th scope="row">{i++}</th>
          <td>{account}</td>
          <td>Dropbox</td>
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
                path="/managedrives/added"
                render={() => {
                  const { token } = this.props.user;
                  this.props.fetchDriveAccountsList(token);
                  return <div>Drive Account added successfully</div>;
                }}
              />
              <Route
                path="/managedrives/removedAll"
                render={() => {
                  const { token } = this.props.user;
                  this.props.fetchDriveAccountsList(token);
                  return <div>All accounts are removed successfully</div>;
                }}
              />
              <Route
                path="/managedrives/removed"
                render={() => {
                  const { token } = this.props.user;
                  this.props.fetchDriveAccountsList(token);
                  return <div>Account is removed successfully</div>;
                }}
              />
              <Route
                path="/managedrives/failed"
                render={() => (
                  <div>
                    An error occured while adding drive account. Please try
                    again.
                  </div>
                )}
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
            <Button color="primary" 
            outline
            onClick={this.handleDropboxClick}>
              Add DropBox
            </Button>
            <Button color="dark" outline>
              Add OneDrive
            </Button>
          </ButtonGroup>
          <h3>Drive Accounts</h3>
          {mapGoogleAccountsToTr.length && (
            <div>
              <Button
                color="secondary"
                outline
                onClick={this.handleRemoveAllAccounts}
              >
                Remove All Accounts
              </Button>
            </div>
          )}
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Account Email</th>
                <th>Drive</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>{mapGoogleAccountsToTr}
            {mapDropboxAccountsToTr}</tbody>
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
  {
    addDrive,
    fetchDriveAccountsList,
    requestRemoveAllGoogleDriveAccounts,
    requestRemoveGoogleAccountByEmail
  }
)(requireAuth(ManageDrives));
