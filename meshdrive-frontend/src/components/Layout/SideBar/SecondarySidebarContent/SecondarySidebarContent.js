import React from "react";
import "./styles.css";

export default props => {
  return <div className="sidebar-secondary flex-fill">{props.children}</div>;
};
