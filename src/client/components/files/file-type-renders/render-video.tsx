import { Box } from "@mui/material";
import { RenderFileProps } from "../file-preview.tsx";
import {
    getFsServerUrl,
    FsAction,
    FsObject,
} from "@/server/routes/api/constants";

export const RenderVideo = ({ fileUrl }: RenderFileProps) => {
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
