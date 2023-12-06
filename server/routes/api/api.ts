import { Router } from "express";
import {
    BROWSE_PREFIX,
    createDir,
    fileUploadScreen,
    getFile,
    listDirContents,
    writeFile,
} from "./browse";

const apiRouter = Router({ strict: true, caseSensitive: true });

apiRouter.route(`${BROWSE_PREFIX}*/`).get(listDirContents).post(createDir);
apiRouter.route(`${BROWSE_PREFIX}*`).get(getFile).post(writeFile);

// Testing only
apiRouter.use("/upload/", fileUploadScreen);

export { apiRouter };
