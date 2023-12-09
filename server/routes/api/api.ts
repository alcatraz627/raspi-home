import { Router } from "express";
import {
    BROWSE_PREFIX,
    createDir,
    deleteFile,
    fileUploadScreen,
    getFile,
    listDirContents,
    moveFile,
    writeFile,
} from "./browse";

const apiRouter = Router({ strict: true, caseSensitive: true });

apiRouter.route(`${BROWSE_PREFIX}*/`).get(listDirContents).post(createDir);
apiRouter
    .route(`${BROWSE_PREFIX}*`)
    .get(getFile)
    .post(writeFile)
    .patch(moveFile)
    .delete(deleteFile);

// Testing only
apiRouter.use("/upload/", fileUploadScreen);

export { apiRouter };
