import { Home, SdStorage, SvgIconComponent } from "@mui/icons-material";
import { BrowserRouter, Route, RouteObject, Routes } from "react-router-dom";
import { DirectoryPage } from "../pages/directory-page";
import { HomePage } from "../pages/home-page";
import { QueryKeys } from "../utils/use-directory-state/use-query-param";
import { FunctionComponent } from "react";
import { RouteLinks } from "./routes.utils";

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
                    <Route index element={<HomePage />} />
                </Routes>
            </LayoutComponent>
        </BrowserRouter>
    );
};
