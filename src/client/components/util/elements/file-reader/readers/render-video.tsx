import { Box } from "@mui/material";
import { FileReaderProps } from "../utils/utils";
import {
    getFsServerUrl,
    FsAction,
    FsObject,
} from "@/server/routes/api/constants";

export const RenderVideo = ({ fileUrl, height }: FileReaderProps) => {
    const videoSrc = getFsServerUrl({
        fsAction: FsAction.Read,
        fsObject: FsObject.File,
        queryPath: fileUrl,
    });

    return (
        <Box key={fileUrl} bgcolor={"rgba(0, 0, 0, 0.12)"}>
            <video src={videoSrc} width="100%" height={height} controls />
        </Box>
    );
};
