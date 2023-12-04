import ReactDOM from "react-dom/server";
import { App } from "../../client/App";
import React from "react";

export function render() {
  const html = ReactDOM.renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  return { html };
}
