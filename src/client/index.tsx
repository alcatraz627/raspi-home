import React from "react";
import ReactDOM from "react-dom/client";
import { AppRoutes } from "./routes/app-routes.js";
import { Layout } from "./components/util/layout/parent";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AppRoutes Layout={Layout} />
    </React.StrictMode>
);
