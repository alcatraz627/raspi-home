import { HomePage } from "@/client/pages/home";
import { DirectoryPage } from "@/client/pages/directory";

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
