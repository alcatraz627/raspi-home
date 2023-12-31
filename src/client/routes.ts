import { Home, SdStorage, SvgIconComponent } from "@mui/icons-material";
import { RouteObject } from "react-router-dom";
import { DirectoryPage } from "./pages/directory-page";
import { HomePage } from "./pages/home-page";

// const ServerPath = "@path";

export enum RouteKey {
    home = "home",
    browse = "browse",
}

const RouteLinks: Record<RouteKey, string> = {
    [RouteKey.home]: "/",
    [RouteKey.browse]: `/browse/*`,
} as const;

export const RouteMap: Record<
    RouteKey,
    RouteObject & {
        key: string;
        getPath: (...p: string[]) => string;
        pageOptions?: {
            showDrawer?: boolean;
            showAppBar?: boolean;
        };
        Icon?: SvgIconComponent;
    }
> = {
    [RouteKey.browse]: {
        key: RouteKey.browse,
        path: RouteLinks.browse,
        Icon: SdStorage,
        Component: DirectoryPage,
        pageOptions: {
            showDrawer: true,
        },
        getPath: (path) =>
            RouteLinks.browse.replace(
                "*",
                path.startsWith("/") ? path.substring(1) : path
            ),
    },
    [RouteKey.home]: {
        key: RouteKey.home,
        path: RouteLinks.home,
        Component: HomePage,
        Icon: Home,
        getPath: () => "/",
    },
};

export const routes: RouteObject[] = Object.values(RouteMap).map<RouteObject>(
    ({ path, Component }) =>
        ({
            path,
            Component,
        }) as RouteObject
);
