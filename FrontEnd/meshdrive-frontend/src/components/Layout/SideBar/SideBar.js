import React from "react";
import PrimarySideBarContent from "./PrimarySidebarContent/PrimarySidebarContent";
import SecondarySideBarContent from "./SecondarySidebarContent/SecondarySidebarContent";
import "./styles.css";
const SideBar = props => {
  return (
    <div className="sidebar d-flex">
      {props.secondary ? (
        <SecondarySideBarContent>{props.children}</SecondarySideBarContent>
      ) : (
        <PrimarySideBarContent />
      )}
    </div>
  );
};

export default SideBar;
