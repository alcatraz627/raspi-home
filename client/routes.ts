import { DirectoryPage } from "@/client/pages/directory-page";
import { HomePage } from "@/client/pages/home-page";
import { RouteObject } from "react-router-dom";

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
    RouteObject & { key: string; getPath: (...p: string[]) => string }
> = {
    [RouteKey.browse]: {
        key: RouteKey.browse,
        path: RouteLinks.browse,
        Component: DirectoryPage,
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
