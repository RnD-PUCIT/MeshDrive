import React, { Component } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import UploadFile from "./pages/UploadFile/UploadFile";
import EditProfile from "./pages/EditProfile/EditProfile";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import VerifySuccess from "./pages/VerifySuccess/VerifySuccess";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
class App extends Component {
  render() {
    return (
      <div id="App" className="d-flex flex-column flex-fill">
        <Router>
          <Layout>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/dashboard" exact component={Dashboard} />
              <Route path="/uploadfile" exact component={UploadFile} />
              <Route path="/editprofile" exact component={EditProfile} />
              <Route path="/login" exact component={Login} />
              <Route path="/signup" exact component={Signup} />
              <Route path="/verifysuccess" exact component={VerifySuccess} />
              <Route path="/forgotpassword" exact component={ForgotPassword} />
              <Route
                path="/resetpassword/:id"
                exact
                component={ResetPassword}
              />
            </Switch>
          </Layout>
        </Router>
      </div>
    );
  }
}

export default App;
