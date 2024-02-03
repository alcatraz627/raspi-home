import { Box, useTheme } from "@mui/material";
import {
    getFsServerUrl,
    FsAction,
    FsObject,
} from "@/server/routes/api/constants";
import { FileReaderProps } from "../utils/utils";

export const RenderImage = ({ fileUrl, height }: FileReaderProps) => {
    const imgSrc = getFsServerUrl({
        fsAction: FsAction.Read,
        fsObject: FsObject.File,
        queryPath: fileUrl,
    });

    return (
        <Box textAlign="center" bgcolor={"rgba(0, 0, 0, 0.12)"}>
            <img src={imgSrc} style={{ height, maxWidth: "100%" }} />
        </Box>
    );
};
