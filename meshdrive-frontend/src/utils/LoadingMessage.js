import React from "react";
import { PulseLoader } from "react-spinners";

export default props => {
  const { loaderArgs = {} } = props;
  return (
    <div className="d-flex">
      {props.children}
      <PulseLoader
        css={{
          marginLeft: 12
        }}
        sizeUnit={"px"}
        size={10}
        loading={true}
        {...loaderArgs}
      />
    </div>
  );
};
