import { HttpMethods } from "@/server/utils/constants.ts";
import { ensureMethod } from "@/server/utils/middleware.ts";
import fs from "node:fs/promises";
import path from "node:path";
import { FsAction, FsObject } from "../constants.ts";
import { FsActionHandler, FsRequestHandler } from "../interfaces.ts";
import { DataFolderPath, TrashFolderPath } from "../utils.ts";
import { getFsServerUrl } from "../constants.ts";
import Busboy from "busboy";

export const readFile: FsActionHandler = async (req, res) => {
    const { path: filePath } = req.query;
    const fullPath = path.join(DataFolderPath, filePath);

    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
        return res
            .status(400)
            .json({
                error: "This is a directory",
                value: getFsServerUrl({
                    fsAction: FsAction.Read,
                    fsObject: FsObject.Folder,
                    queryPath: filePath,
                }),
            })
            .end();
    }

    const fileData = await fs.readFile(fullPath).catch((e) => {
        res.status(404).json({
            error: (e as Error).message,
            filePath,
        });
    });

    if (!fileData) {
        return;
    }

    res.sendFile(fullPath);
};

export const renameFile: FsActionHandler = async (req, res) => {
    const { path: oldPath, newPath } = req.query;

    if (!newPath) {
        return res.status(400).json({ error: "No newPath provided" });
    }
    const filePath = path.join(DataFolderPath, oldPath);
    const newFilePath = path.join(DataFolderPath, newPath);

    try {
        await fs.rename(filePath, newFilePath);

        return res
            .status(201)
            .json({ path: newPath, newPath: newFilePath })
            .end();
    } catch (error) {
        return res.status(400).json({ error });
    }
};

export const createFile: FsActionHandler = async (req, res) => {
    const { path: filePath } = req.query;
    const fullPath = path.join(DataFolderPath, filePath);

    const areFilesUploaded = req.headers["content-type"]?.startsWith(
        "multipart/form-data"
    );

    if (!areFilesUploaded) {
        const fileHandle = await fs.open(fullPath, "w");
        await fileHandle.close();

        return res.status(201).json({ path: filePath }).end();
    } else {
        const busboy = Busboy({ headers: req.headers });

        busboy.on("file", async (_name, file, _info) => {
            const fileHandle = await fs.open(fullPath, "w");
            file.pipe(fileHandle.createWriteStream());
        });

        busboy.on("finish", async () => {
            return res.status(201).json({ path: filePath }).end();
        });

        req.pipe(busboy);
    }
};

export const updateFile: FsActionHandler = async (req, res) => {
    const { path: filePath } = req.query;

    const fullPath = path.join(DataFolderPath, filePath);

    req.on("data", async (data) => {
        const fileHandle = await fs.open(fullPath, "w");
        fileHandle.writeFile(data);
        await fileHandle.close();
    });

    return res.status(201).json({ path: filePath }).end();
};

export const deleteFile: FsActionHandler = async (req, res) => {
    const { path: filePath } = req.query;

    const fullPath = path.join(DataFolderPath, filePath);
    const trashedPath = path.join(TrashFolderPath, filePath);

    try {
        await fs.rename(fullPath, trashedPath);
    } catch (error) {
        await fs.rm(fullPath);
    }

    return res.status(201).json({ path: filePath }).end();
};

const handlerMethodMap: Record<FsAction, [HttpMethods, FsActionHandler]> = {
    [FsAction.Read]: [HttpMethods.GET, readFile],
    [FsAction.Rename]: [HttpMethods.PUT, renameFile],
    [FsAction.Create]: [HttpMethods.POST, createFile],
    [FsAction.Update]: [HttpMethods.PATCH, updateFile],
    [FsAction.Delete]: [HttpMethods.DELETE, deleteFile],
};

export const fileHandler: FsRequestHandler = async (req, res, next) => {
    try {
        const { action: fsAction } = req.params;
        const invalidMethodHandler = ensureMethod(req, res);

        if (!(fsAction in handlerMethodMap)) {
            return res
                .status(200)
                .json({
                    fsObject: FsObject.File,
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
        console.log("file/error", error);
        return res.status(500).json({ error }).end();
    }
};
