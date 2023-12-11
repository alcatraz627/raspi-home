import { Router } from "express";
import {
    BROWSE_PREFIX,
    createDir,
    createFile,
    deleteFile,
    fileUploadScreen,
    getFile,
    listDirContents,
    moveFile,
} from "./browse";

const apiRouter = Router({ strict: true, caseSensitive: true });

apiRouter.route(`${BROWSE_PREFIX}*/`).get(listDirContents).post(createDir);
apiRouter
    .route(`${BROWSE_PREFIX}*`)
    .get(getFile)
    .post(createFile)
    .patch(moveFile)
    .delete(deleteFile);

// Testing only
apiRouter.use("/upload/", fileUploadScreen);

export { apiRouter };
