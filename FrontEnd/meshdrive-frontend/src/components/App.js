import React, { Component } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import UploadFile from "./pages/UploadFile/UploadFile";
import EditProfile from "./pages/EditProfile/EditProfile";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
class App extends Component {
  render() {
    return (
      <div id="App" className="d-flex flex-column flex-fill">
        <Router>
          <Layout>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/uploadfile" exact component={UploadFile} />
              <Route path="/editprofile" exact component={EditProfile} />
              <Route path="/login" exact component={Login} />
              <Route path="/signup" exact component={Signup} />
              <Route path="/forgotpassword" exact component={ForgotPassword} />
            </Switch>
          </Layout>
        </Router>
      </div>
    );
  }
}

export default App;
