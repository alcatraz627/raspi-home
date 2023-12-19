import path from "node:path";
import { BROWSE_PREFIX } from "./constants";
import { API_PREFIX, FsAction, FsObject } from "./constants";

export const DataFolderPath = path.join(__dirname, "..", "..", "..", "data");
export const TrashFolderPath = path.join(__dirname, "..", "..", "..", "trash");

export const getUrlPath = (originalPath: string, prefix = BROWSE_PREFIX) =>
    originalPath.replace(prefix, "");

export const getFsServerUrl = ({
    fsAction,
    fsObject,
    prefixes = [API_PREFIX, BROWSE_PREFIX],
    queryPath,
    otherParams = {},
}: {
    fsAction: FsAction;
    fsObject: FsObject;
    prefixes?: string[];
    queryPath?: string;
    otherParams?: { newPath: string } | Record<string, string>;
}) => {
    let serverUrlPrefix = ["", ...prefixes, fsObject, fsAction, ""].join("/");

    const queryParams = new URLSearchParams(otherParams);
    if (queryPath) {
        const resolvedPath = queryPath.startsWith("/")
            ? queryPath.slice(1)
            : queryPath;

        queryParams.append("path", resolvedPath);
    }

    if (queryParams.toString()) {
        serverUrlPrefix += `&${queryParams.toString()}`;
    }

    return serverUrlPrefix;
};
