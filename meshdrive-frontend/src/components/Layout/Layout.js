import React from "react";
import Header from "./Header/Header";
import MainContent from "./MainContent/MainContent";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Footer from "./Footer/Footer";

const Layout = props => {
  return (
    <React.Fragment>
      {/* <Header /> */}
      <MainContent>{props.children}</MainContent>

      {/* <Footer /> */}
    </React.Fragment>
  );
};
export default Layout;
