import { Box } from "@mui/material";
import { RenderFileProps } from "../file-preview";
import {
    FsAction,
    FsObject,
    getFsServerUrl,
} from "@/server/routes/api/constants";

export const RenderImage = ({ fileUrl }: RenderFileProps) => {
    const imgSrc = getFsServerUrl({
        fsAction: FsAction.Read,
        fsObject: FsObject.File,
        queryPath: fileUrl,
    });

    return (
        <Box>
            <img src={imgSrc} width="100%" />
        </Box>
    );
};
