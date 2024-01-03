import { FsActionHandler } from "../routes/api/interfaces";
import { HttpMethods } from "./constants";

/**
 * Use `?m=POST` to override the http method
 */
export const ensureMethod =
    (
        req: Parameters<FsActionHandler>[0],
        res: Parameters<FsActionHandler>[1]
    ) =>
    (method: HttpMethods = HttpMethods.POST) => {
        if (req.query.m && req.query.m === method) return;

        if (req.method == method) return;

        return res
            .status(400)
            .json({
                error: "Invalid method",
                value: req.method,
                fix: method,
            })
            .end();
    };
