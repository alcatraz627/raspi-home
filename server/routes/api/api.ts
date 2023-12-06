import express from "express";
import {
    getFile,
    createFile,
    listDirContents,
    createDir,
    fileUploadScreen,
} from "./directory";

const apiRouter = express.Router();

apiRouter.route("/file*").get(getFile).post(createFile);
apiRouter.route("/directory*").get(listDirContents).post(createDir);

apiRouter.use("/upload", fileUploadScreen);

export { apiRouter };
