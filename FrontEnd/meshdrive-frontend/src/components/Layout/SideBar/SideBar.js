import React from "react";
import LeftSideBarContent from './LeftSidebarContent/LeftSidebarContent';
import RightSideBarContent from './RightSidebarContent/RightSidebarContent';
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
