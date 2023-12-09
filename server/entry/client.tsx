import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "../../client/routes";
import { Layout } from "../../client/components/layout";

const router = createBrowserRouter(routes);

ReactDOM.hydrateRoot(
    document.getElementById("root")!,
    <React.StrictMode>
        <Layout>
            <RouterProvider router={router} />
        </Layout>
    </React.StrictMode>
);
