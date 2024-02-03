import { Box } from "@mui/material";
import {
    getFsServerUrl,
    FsAction,
    FsObject,
} from "@/server/routes/api/constants";
import { FileReaderProps } from "../utils/utils";

export const RenderImage = ({ fileUrl }: FileReaderProps) => {
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
