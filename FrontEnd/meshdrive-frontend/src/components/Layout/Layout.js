import React from "react";
import Header from "./Header/Header";
import SideBar from "./SideBar/SideBar";
import MainContent from "./MainContent/MainContent";
import Footer from "./Footer/Footer";

const Layout = props => {
  return (
    <React.Fragment>
      <div id="main" className="d-flex flex-column flex-fill">
        <Header />
        <div className="d-flex flex-row flex-fill">
          <SideBar />
          <MainContent>
            <div className="d-flex flex-column flex-grow w-100">
              {props.children}
            </div>
          </MainContent>
        </div>
      </div>

      {/* <Footer /> */}
    </React.Fragment>
  );
};
export default Layout;
