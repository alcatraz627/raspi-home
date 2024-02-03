import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DirectoryPage } from "../pages/directory-page";
import { HomePage } from "../pages/home-page";
import { FunctionComponent } from "react";
import { RouteLinks } from "./routes.utils";
import { Message } from "../components/util/common/message.components";

const ComingSoonPage = () => {
    return (
        <Message
            sx={{
                borderRadius: 2,
                p: 12,
                margin: "auto",
                flexDirection: "column",
            }}
            disablePadding
        >
            Coming soon
            <br />
            <br />
            <code>{window.location.pathname}</code>
        </Message>
    );
};

export interface AppRoutesProps {
    Layout?: FunctionComponent<{ children: JSX.Element }>;
}

export const AppRoutes: FunctionComponent<AppRoutesProps> = ({ Layout }) => {
    const LayoutComponent: typeof Layout =
        Layout ?? (({ children }) => <div>{children}</div>);

    return (
        <BrowserRouter>
            <LayoutComponent>
                <Routes>
                    <Route
                        path={RouteLinks.browse}
                        element={<DirectoryPage />}
                    />
                    <Route
                        path={RouteLinks.settings}
                        element={<ComingSoonPage />}
                    />
                    <Route index element={<HomePage />} />
                </Routes>
            </LayoutComponent>
        </BrowserRouter>
    );
};
