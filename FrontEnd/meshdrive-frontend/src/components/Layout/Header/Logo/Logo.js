import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
export default () => {
  return (
    <Link to="/" id="Logo" className="logo-wrapper p-2 ">
      <h4 className="logo text-center p-1 bg-white">MeshDrive</h4>
    </Link>
  );
};
