import { Box } from "@mui/material";
import { FileReaderProps } from "../file-reader-wrapper.tsx";
import {
    getFsServerUrl,
    FsAction,
    FsObject,
} from "@/server/routes/api/constants";

export const RenderVideo = ({ fileUrl }: FileReaderProps) => {
    const videoSrc = getFsServerUrl({
        fsAction: FsAction.Read,
        fsObject: FsObject.File,
        queryPath: fileUrl,
    });

    return (
        <Box key={fileUrl}>
            <video src={videoSrc} width="100%" controls />
        </Box>
    );
};
