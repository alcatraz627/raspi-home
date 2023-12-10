import { fetchServerFile } from "@/client/api";
import { useServerData } from "@/client/utils/use-server-data/use-server-data";
import { Box, CircularProgress, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { RenderFileProps } from "../file-preview";

export const RenderText = ({ fileUrl }: RenderFileProps) => {
    const [fileData, fileActions, fileStatus] = useServerData(fetchServerFile);
    const [content, setContent] = useState<string | null>(null);

    const loadFileContent = async (fileUrlProp: string) => {
        const data = await fileActions.query(fileUrlProp);
        setContent(data.file);
    };

    useEffect(() => {
        if (fileUrl) {
            loadFileContent(fileUrl);
        }
    }, [fileUrl]);

    return (
        <Box width="100%">
            {fileStatus.isLoading && <CircularProgress />}
            {fileStatus.isError && <div>Error</div>}

            {fileStatus.isSuccess && content && (
                <TextField fullWidth multiline rows={12} value={content} />
            )}
        </Box>
    );
};
