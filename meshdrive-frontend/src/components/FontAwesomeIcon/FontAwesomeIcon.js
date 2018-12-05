import React from "react";

export default props => {
  let htmlClasses = "icon fa-" + props.icon;
  if (Array.isArray(props.classes)) {
    htmlClasses += " " + props.classes.join(" ");
  }

  return <span className={htmlClasses} />;
};
