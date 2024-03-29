import React, { Component } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { loadProgressBar } from "axios-progress-bar";

import { connect } from "react-redux";
import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import UserProfile from './pages/UserProfile/UserProfile'
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageDrives from "./pages/ManageDrives/ManageDrives";
import UploadFile from "./pages/UploadFile/UploadFile";
import EditProfile from "./pages/EditProfile/EditProfile";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import Signup from "./pages/Signup/Signup";
import VerifySuccess from "./pages/VerifySuccess/VerifySuccess";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ManageTags from "./pages/ManageTags/ManageTags";

import "react-toastify/dist/ReactToastify.css";
import "axios-progress-bar/dist/nprogress.css";

import initUserObjFromLocalStorage from "../actions/user/initUserObjFromLocalStorage";
import UsersSearchResult from "./pages/UsersSearchResult/UsersSearchResult";

class App extends Component {
  initToken = () => {
    const { token } = this.props.user;
    if (token === null || token === undefined) {
      this.props.initUserObjFromLocalStorage();
    }
  };

  componentWillMount() {
    loadProgressBar({ showSpinner: false });
    this.initToken();
  }
  componentDidMount() {}

  componentDidUpdate(prevProps) {
    const prevUserStringify = JSON.stringify(prevProps.user);
    const userStringify = JSON.stringify(this.props.user);

    if (prevUserStringify === userStringify) return;

    this.initToken();
  }

  render() {
  
   
    return (
      
      <div id="App" className="d-flex flex-column flex-fill">
        <Router>
          <Layout>
            <Switch>
              <Route path="/managedrives" component={ManageDrives} />
              <Route path="/dashboard" exact component={Dashboard} />
              <Route path="/uploadfile" exact component={UploadFile} />
              <Route path="/editprofile" exact component={EditProfile} />
              <Route path="/login" exact component={Login} />
              <Route path="/logout" exact component={Logout} />
              <Route path="/signup" exact component={Signup} />
              <Route path="/verifysuccess" exact component={VerifySuccess} />
              <Route path="/forgotpassword" exact component={ForgotPassword} />
              <Route path="/managetags" exact component={ManageTags} />
              <Route path ="/profile/:email" component={UserProfile} />  
              {/* // render = {(props)=><UserProfile {...props} email={this.props.user.email}/>}/> */}
              <Route path="/userresult" exact component={UsersSearchResult}/>
              <Route
                path="/resetpassword/:id"
                exact
                component={ResetPassword}
              />
              <Route path="/" exact component={Home} />
            </Switch>
            <ToastContainer />
          </Layout>
        </Router>
      </div>
    );
  }
}
function mapStateToProps({ user }) {
  return { user };
}
export default connect(
  mapStateToProps,
  {
    initUserObjFromLocalStorage
  }
)(App);
