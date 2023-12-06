import busboy from "busboy";
import { Request, Response } from "express";
import fs from "node:fs/promises";
import path from "node:path";

export const DataFolderPath = path.join(__dirname, "..", "..", "..", "data");

export const BROWSE_PREFIX = "/browse";

const getUrlPath = (originalPath: string, prefix = BROWSE_PREFIX) =>
    originalPath.replace(prefix, "");

export const listDirContents = async (
    req: Request,
    res: Response<
        | { path: string; directories: string[]; files: string[] }
        | { error: string }
    >
) => {
    try {
        const queryPath = getUrlPath(req.path);
        const folder = path.join(DataFolderPath, queryPath);

        const contents = await fs
            .readdir(folder, {
                withFileTypes: true,
            })
            .catch((e) => {
                console.log(e);
                return [];
            });

        const directories = contents
            .filter((d) => d.isDirectory())
            .map((d) => d.name);
        const files = contents.filter((d) => d.isFile()).map((d) => d.name);

        res.json({ path: queryPath, directories, files });
    } catch (e) {
        res.status(404).json({ error: (e as Error).message });
    }
};

export const createDir = async (req: Request, res: Response) => {
    try {
        const queryPath = getUrlPath(req.path);
        const folder = path.join(DataFolderPath, queryPath);

        await fs.mkdir(folder, {
            recursive: true,
        });

        res.redirect(201, req.url);
    } catch (e) {
        res.status(404).json({ error: (e as Error).message });
    }
};

export const getFile = async (
    req: Request<undefined, any, any, { path?: string }>,
    res: Response<string | any | Buffer | { error: string }>
) => {
    try {
        const queryPath = getUrlPath(req.path);
        const filePath = path.join(DataFolderPath, queryPath);

        if ((await fs.stat(filePath)).isDirectory()) {
            res.redirect(302, "/api" + req.url + "/");
        }

        res.sendFile(filePath);
    } catch (e) {
        res.status(404).json({ error: (e as Error).message });
    }
};

export const fileUploadScreen = (
    req: Request<undefined, any, any, { path?: string }>,
    res: Response<string>
) => {
    const filePath = req.query.path || "/default.png";

    res.send(
        `
<form action="/file?path=${filePath}" enctype="multipart/form-data" method="POST">
    <input type="file" name="file" /><br />
    <input type="text" name="path" value="${filePath}" /><br />
    <button type="submit">submit</button>
</form>
    `
    ).end();
};

export const writeFile = async (
    req: Request<undefined, any, any, { path?: string }>,
    res: Response
) => {
    try {
        const queryPath = req.query.path || "/";
        const filePath = path.join(DataFolderPath, queryPath);

        const uploadEvent = busboy({ headers: req.headers });

        uploadEvent.on("file", (name, file, info) => {
            fs.writeFile(filePath, file, { encoding: "utf-8" });
        });

        uploadEvent.on("close", () => {
            console.log("close");

            res.json({ queryPath, filePath }).end();
        });

        req.pipe(uploadEvent);
    } catch (e) {
        res.status(404).json({ error: (e as Error).message });
    }
};
