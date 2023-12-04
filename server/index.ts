import express from "express";
import React from "react";
import ReactDOM from "react-dom/server";

import { App } from "../client/App";
import { getHtmlPage } from "./utils/template";

const PORT = 3000;

const server = express();

server.get("/", (req, res) => {
  const reactInitial = ReactDOM.renderToString(React.createElement(App));
  getHtmlPage(reactInitial).then((html) => {
    res.header("Content-Type", "text/html").send(html);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
