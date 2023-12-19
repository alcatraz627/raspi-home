import { HttpMethods } from "@/server/utils/constants";
import { ensureMethod } from "@/server/utils/middleware";
import fs from "node:fs/promises";
import path from "node:path";
import { FsAction, FsObject } from "../constants";
import { FsActionHandler, FsRequestHandler } from "../interfaces";
import { DataFolderPath, TrashFolderPath } from "../utils";

export const listFolder: FsActionHandler = async (req, res) => {
    const { path: folderPath } = req.query;
    const folder = path.join(DataFolderPath, folderPath);

    const contents = await fs
        .readdir(folder, {
            withFileTypes: true,
        })
        .catch((e) => {
            res.status(404).json({ error: (e as Error).message, folderPath });
        });

    if (!contents) {
        return;
    }

    const folders = contents.filter((d) => d.isDirectory()).map((d) => d.name);
    const files = contents.filter((d) => d.isFile()).map((d) => d.name);

    res.json({ path: folderPath, folders, files }).end();
};

export const renameFolder: FsActionHandler = async (req, res) => {
    const { path: oldPath, newPath } = req.query;

    if (!newPath) {
        return res.status(400).json({ error: "No newPath provided" });
    }
    const folderPath = path.join(DataFolderPath, oldPath);
    const newFolderPath = path.join(DataFolderPath, newPath);

    try {
        await fs.rename(folderPath, newFolderPath);

        return res.status(201).json({ path: newPath }).end();
    } catch (error) {
        return res.status(400).json({ error });
    }
};

export const createFolder: FsActionHandler = async (req, res) => {
    const { path: folderPath } = req.query;

    const fullPath = path.join(DataFolderPath, folderPath);

    await fs.mkdir(fullPath, {
        recursive: true,
    });

    return res.status(201).json({ path: folderPath }).end();
};

export const updateFolder: FsActionHandler = async (req, res) => {
    return res
        .status(200)
        .json({ message: "Update is not supported for folders yet" })
        .end();
};

export const deleteFolder: FsActionHandler = async (req, res) => {
    const { path: folderPath } = req.query;

    const fullPath = path.join(DataFolderPath, folderPath);
    const trashedPath = path.join(TrashFolderPath, folderPath);

    try {
        await fs.rename(fullPath, trashedPath);
    } catch (error) {
        await fs.rmdir(fullPath);
    }

    return res.status(201).json({ path: folderPath }).end();
};

const handlerMethodMap: Record<FsAction, [HttpMethods, FsActionHandler]> = {
    [FsAction.Read]: [HttpMethods.GET, listFolder],
    [FsAction.Rename]: [HttpMethods.PUT, renameFolder],
    [FsAction.Create]: [HttpMethods.POST, createFolder],
    [FsAction.Update]: [HttpMethods.PATCH, updateFolder],
    [FsAction.Delete]: [HttpMethods.DELETE, deleteFolder],
};

export const folderHandler: FsRequestHandler = async (req, res, next) => {
    try {
        const { action: fsAction } = req.params;
        const invalidMethodHandler = ensureMethod(req, res);

        if (!(fsAction in handlerMethodMap)) {
            return res
                .status(200)
                .json({
                    fsObject: FsObject.Folder,
                    fsAction,
                    message: "No handler for this action",
                })
                .end();
        }

        const [requiredMethod, responseFn] = handlerMethodMap[fsAction];

        const invalidMethodErr = invalidMethodHandler(requiredMethod);
        if (invalidMethodErr) return invalidMethodErr;

        return await responseFn(req, res);
    } catch (error) {
        console.log("folder/error", error);
        return res.status(500).json({ error }).end();
    }
};
