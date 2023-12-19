import {
    API_PREFIX,
    BROWSE_PREFIX,
    FsAction,
    FsObject,
} from "@/server/routes/api/constants";
import { ListDirResponse } from "@/server/routes/api/interfaces";
import { getFsServerUrl } from "@/server/routes/api/constants";
import axios from "axios";

const getApiUrl = (
    fsAction: FsAction,
    fsObject: FsObject,
    queryPath: string,
    newDirPath?: string
) =>
    getFsServerUrl({
        fsAction,
        fsObject,
        queryPath,
        prefixes: [API_PREFIX, BROWSE_PREFIX],
        otherParams: {
            ...(newDirPath && { newPath: newDirPath }),
        },
    });

// Folder methods
export const readServerDirectory = async (dirPath = "") =>
    (
        await axios.get<ListDirResponse>(
            getApiUrl(FsAction.Read, FsObject.Folder, dirPath)
        )
    ).data;

export const createServerDirectory = async (dirPath: string) =>
    (
        await axios.post<{ path: string }>(
            getApiUrl(FsAction.Create, FsObject.Folder, dirPath)
        )
    ).data;

export const renameServerDirectory = async (
    dirPath: string,
    newDirPath: string
) =>
    (
        await axios.post<{ path: string; newPath: string }>(
            getApiUrl(FsAction.Rename, FsObject.Folder, dirPath, newDirPath)
        )
    ).data;

export const deleteServerDirectory = async (dirPath: string) =>
    (
        await axios.delete<{ path: string }>(
            getApiUrl(FsAction.Delete, FsObject.Folder, dirPath)
        )
    ).data;

// File methods
export const readServerFile = async (filePath: string) => {
    const resp = await axios.get<string>(
        getApiUrl(FsAction.Read, FsObject.File, filePath),
        {
            responseType: "text",
        }
    );
    return { file: resp.data, contentType: resp.headers["content-type"] };
};

export const createServerFile = async (filePath: string) => {
    const resp = await axios.post<{ path: string }>(
        getApiUrl(FsAction.Create, FsObject.File, filePath)
    );
    return resp.data;
};

export const updateServerFile = async (filePath: string, content: string) => {
    const resp = await axios.patch<{ path: string }>(
        getApiUrl(FsAction.Update, FsObject.File, filePath),
        content
    );
    return resp.data;
};

export const moveServerFile = async (filePath: string, newFilePath: string) => {
    const resp = await axios.patch<{ path: string; newPath: string }>(
        getApiUrl(FsAction.Rename, FsObject.File, filePath, newFilePath)
    );
    return resp.data;
};

export const deleteServerFile = async (filePath: string): Promise<void> => {
    await axios.delete(getApiUrl(FsAction.Delete, FsObject.File, filePath));
};
