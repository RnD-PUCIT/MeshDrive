import React from "react";
import LeftSideBarContent from "./LeftSideBarContent/LeftSideBarContent";
import RightSideBarContent from "./RightSideBarContent/RightSideBarContent";
import "./styles.css";
const SideBar = props => {
  return (
    <div className="sidebar d-flex">
      {props.right ? (
        <RightSideBarContent>{props.children}</RightSideBarContent>
      ) : (
        <LeftSideBarContent />
      )}
    </div>
  );
};

export default SideBar;
