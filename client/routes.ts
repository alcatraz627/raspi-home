import { HomePage } from "./pages/home";
import { DirectoryPage } from "./pages/directory";

export const RouteMap = {
    home: {
        key: "home",
        path: "/",
        Component: HomePage,
    },
    directory: {
        key: "Browse",
        path: "/browse",
        Component: DirectoryPage,
    },
};

export const routes = Object.values(RouteMap).map(({ path, Component }) => ({
    path,
    Component,
}));
