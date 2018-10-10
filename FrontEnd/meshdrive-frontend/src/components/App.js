import React, { Component } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import UploadFile from "./pages/UploadFile/UploadFile";
class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/uploadfile" exact component={UploadFile} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
