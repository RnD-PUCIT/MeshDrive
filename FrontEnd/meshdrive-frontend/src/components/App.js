import React, { Component } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import UploadFile from "./pages/UploadFile/UploadFile";
import Login from "./pages/Login/Login";
class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/uploadfile" exact component={UploadFile} />
            <Route path="/login" exact component={Login} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
