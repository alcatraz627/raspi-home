import { Box } from "@mui/material";
import { FileReaderProps } from "../utils/utils";
import {
    getFsServerUrl,
    FsAction,
    FsObject,
} from "@/server/routes/api/constants";

export const RenderPdf = ({ fileUrl }: FileReaderProps) => {
    const imgSrc = getFsServerUrl({
        fsAction: FsAction.Read,
        fsObject: FsObject.File,
        queryPath: fileUrl,
    });

    return (
        <Box display="flex" flexGrow={1} height="100vh" key={fileUrl}>
            <embed src={imgSrc} width="100%" height="100%" />
        </Box>
    );
};
