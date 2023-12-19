import path from "node:path";
import { BROWSE_PREFIX } from "./constants";

console.log(__dirname);

export const DataFolderPath = path.join(__dirname, "..", "..", "..", "data");
export const TrashFolderPath = path.join(__dirname, "..", "..", "..", "trash");

export const getUrlPath = (originalPath: string, prefix = BROWSE_PREFIX) =>
    originalPath.replace(prefix, "");
