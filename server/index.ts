import express from "express";
import React from "react";
import ReactDOM from "react-dom/server";

import { App } from "../client/App";

const PORT = 3000;

const server = express();

const getHtmlPage = (app: string) => `
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <div id="root">${app}</div>
    <script src="/bundle.js"></script>
  </body>
</html>
`;

server.get("/", (req, res) => {
  const reactInitial = ReactDOM.renderToString(React.createElement(App));
  res.send(getHtmlPage(reactInitial));
});

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
