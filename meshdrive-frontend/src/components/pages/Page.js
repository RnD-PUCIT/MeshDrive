// module imports
import React, { Component } from "react";

// custom module imports
import pathToCssId from "../../utils/pathToCssId";

export default class Page extends Component {
  componentDidMount() {
    const bodyId = pathToCssId(this.props.match.path);
    document.body.id = "";
    if (bodyId) document.body.id = bodyId;
  }
}
