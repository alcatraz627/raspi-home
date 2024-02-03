import React from "react";
import ReactDOM from "react-dom/client";
import { AppRoutes } from "./routes/app-routes.js";
import { AppWrapper } from "./components/util/layout/app-wrapper.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AppRoutes Layout={AppWrapper} />
    </React.StrictMode>
);
