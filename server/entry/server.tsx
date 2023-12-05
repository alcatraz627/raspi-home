import React from "react";
import ReactDOM from "react-dom/server";
import {
    StaticRouterProvider,
    StaticRouterProviderProps,
} from "react-router-dom/server";
import { Layout } from "../../client/components/Layout";

export function render({
    router,
    context,
}: Pick<StaticRouterProviderProps, "router" | "context">) {
    const html = ReactDOM.renderToString(
        <React.StrictMode>
            <Layout>
                <StaticRouterProvider router={router} context={context} />
            </Layout>
        </React.StrictMode>
    );
    return { html };
}
