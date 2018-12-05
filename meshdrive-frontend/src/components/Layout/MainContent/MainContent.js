import React from "react";

const MainContent = props => {
  return (
    <div className="d-flex flex-fill" id="MainContent">
      {props.children}
    </div>
  );
};

export default MainContent;
