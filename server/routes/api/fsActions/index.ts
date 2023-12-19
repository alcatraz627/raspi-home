import { Request, Response, ErrorRequestHandler } from "express";
import { FsAction, FsObject } from "../constants";
import { folderHandler } from "./folder";
import { FsActionHandler, FsRequestHandler } from "../interfaces";
import { fileHandler } from "./file";

const defaultResponseFn: FsActionHandler = async (req, res) => {
    return res
        .status(200)
        .json({
            action: req.params.action,
            object: req.params.object,
        })
        .end();
};

export const fsErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({ error: err }).end();
};
const handleInvalidRequest: FsActionHandler = async (req, res) => {
    if (
        !req.params.action ||
        !Object.values(FsAction).includes(req.params.action)
    ) {
        return res.status(400).json({
            error: "Invalid action provided",
            value: req.params.action,
        });
    }

    if (
        !req.params.object ||
        !Object.values(FsObject).includes(req.params.object)
    ) {
        return res.status(400).json({
            error: "Invalid object provided",
            value: req.params.object,
        });
    }

    if (!("path" in req.query)) {
        return res.status(400).json({ error: "No path provided" });
    }
};

export const browseHandler: FsRequestHandler = async (req, res, next) => {
    const errResp = await handleInvalidRequest(req, res);
    if (errResp) {
        return errResp;
    }

    const { action: fsAction, object: fsObject } = req.params;
    const { path: fsPath } = req.query;

    switch (fsObject) {
        case FsObject.Folder:
            return await folderHandler(req, res, next);

        case FsObject.File:
            return await fileHandler(req, res, next);

        default:
            break;
    }

    res.status(200).json({ fsAction, fsObject, fsPath, path: "default" }).end();
};

export const fileUploadScreen: FsRequestHandler = async (req, res) => {
    const { path: filePath = "/default.png" } = req.query;

    return res
        .send(
            `
<form action="/file?path=${filePath}" enctype="multipart/form-data" method="POST">
    <input type="file" name="file" /><br />
    <input type="text" name="path" value="${filePath}" /><br />
    <button type="submit">submit</button>
</form>
    `
        )
        .end();
};
