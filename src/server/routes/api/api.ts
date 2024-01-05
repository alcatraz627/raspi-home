import { Router } from "express";
import { BrowseRouterUrlPattern } from "./constants";
import { browseHandler, fileUploadScreen, fsErrorHandler } from "./fsActions";

const apiRouter = Router({ strict: true, caseSensitive: true });

apiRouter.use(BrowseRouterUrlPattern, browseHandler);
apiRouter.use(fsErrorHandler);

// Testing only
apiRouter.use("/upload/", fileUploadScreen);

export { apiRouter };
