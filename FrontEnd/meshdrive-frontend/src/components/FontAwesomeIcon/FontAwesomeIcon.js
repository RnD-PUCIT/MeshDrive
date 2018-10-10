import React from "react";

export default props => {
  return (
    <span
      className={
        "icon fa-" +
        props.icon +
        (props.fab ? " fab" : " fas") +
        " " +
        props.className
      }
    />
  );
};
