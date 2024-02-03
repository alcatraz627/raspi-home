import { SvgIconComponent, SdStorage, Home } from "@mui/icons-material";
import { RouteObject } from "react-router-dom";
import { QueryKeys } from "../utils/use-directory-state/use-query-param";

export enum RouteKey {
    home = "home",
    browse = "browse",
}

export const RouteLinks: Record<RouteKey, string> = {
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
        pageOptions: {
            showDrawer: true,
        },
        getPath: (path, file) =>
            RouteLinks.browse.replace(
                "*",
                path.startsWith("/") ? path.substring(1) : path
            ) + (file ? `?${QueryKeys.Filename}=${file}` : ""),
    },
    [RouteKey.home]: {
        key: RouteKey.home,
        path: RouteLinks.home,
        Icon: Home,
        getPath: () => "/",
    },
};
