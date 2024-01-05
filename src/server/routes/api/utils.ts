import path from "node:path";
import url from "node:url";
import { BROWSE_PREFIX } from "./constants.ts";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const DataFolderPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "data"
);
export const TrashFolderPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "trash"
);

export const getUrlPath = (originalPath: string, prefix = BROWSE_PREFIX) =>
    originalPath.replace(prefix, "");
