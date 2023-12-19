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
