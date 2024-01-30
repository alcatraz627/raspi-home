export const API_PREFIX = "api";

export const BROWSE_PREFIX = "browse";

export enum FsAction {
    Create = "Create",
    Read = "Read",
    Update = "Update",
    Rename = "Rename",
    Delete = "Delete",
}

export enum FsObject {
    File = "File",
    Folder = "Folder",
}

export const BrowseRouterUrlPattern = [
    "",
    BROWSE_PREFIX,
    `:object`,
    `:action`,
].join("/");

const API_ROOT = ""; // For the raspi
// const API_ROOT = "http://192.168.1.11"; // For the raspi

export const getFsServerUrl = ({
    fsAction,
    fsObject,
    prefixes = [API_PREFIX, BROWSE_PREFIX],
    queryPath = "",
    otherParams = {},
}: {
    fsAction: FsAction;
    fsObject: FsObject;
    prefixes?: string[];
    queryPath?: string;
    otherParams?: { newPath: string } | Record<string, string>;
}) => {
    let serverUrlPrefix = [API_ROOT, ...prefixes, fsObject, fsAction, ""].join(
        "/"
    );

    const queryParams = new URLSearchParams(otherParams);
    const resolvedPath = queryPath.startsWith("/")
        ? queryPath.slice(1)
        : queryPath;

    queryParams.append("path", resolvedPath);

    if (queryParams.toString()) {
        serverUrlPrefix += `?${queryParams.toString()}`;
    }

    return serverUrlPrefix;
};
