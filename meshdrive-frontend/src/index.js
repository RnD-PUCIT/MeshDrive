import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

// import "./bootstrap-themes/litera.min.css";
import registerServiceWorker from "./registerServiceWorker";

// store configuration

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
