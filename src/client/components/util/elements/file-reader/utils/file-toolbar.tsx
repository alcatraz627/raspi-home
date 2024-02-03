import { ArrowCircleDown, Close } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Toolbar, Typography } from "@mui/material";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { FileName } from "./file-name";
import { FileType } from "./utils";

export interface FileToolbarProps {
    fileType: FileType;
    fileUrl: string | null;
    SelectFileRenderer: FunctionComponent;

    clearFileSelectionInCache: () => void;
    handleSaveFileName: (newFileUrl: string) => Promise<void>;
}

export const FileToolbar: FunctionComponent<FileToolbarProps> = ({
    fileType,
    fileUrl,
    SelectFileRenderer,
    clearFileSelectionInCache,
    handleSaveFileName,
}) => {
    const [fileNameState, setFileNameState] = useState<string>("");

    const parsedFileName = useMemo(() => {
        if (fileUrl) {
            return fileUrl.split("/").pop() ?? null;
        }

        return null;
    }, [fileUrl]);

    const isFileNameChanged = !!(
        fileUrl && parsedFileName !== fileNameState?.trim()
    );

    const handleResetFileName = () => {
        if (parsedFileName) {
            setFileNameState(parsedFileName);
        }
    };

    const callSaveFileName = async () => {
        if (!!fileUrl) return;

        const newFileUrl =
            fileUrl?.split("/").slice(0, -1).concat(fileNameState).join("/") ||
            "";

        handleSaveFileName(newFileUrl);
    };

    // Update the file name textbox and the renderer being used
    useEffect(() => {
        if (fileUrl) {
            const newParsedFileName = fileUrl.split("/").pop() || "";
            setFileNameState(newParsedFileName);
        }
    }, [fileUrl]);

    // Todo: Save on ctrl + s

    return (
        <Toolbar
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gridGap: "12px",
            }}
        >
            <Typography variant="subtitle2" color="gray">
                {fileType}
            </Typography>

            <FileName
                fileNameState={fileNameState}
                setFileNameState={setFileNameState}
                isFileNameChanged={isFileNameChanged}
                handleResetFileName={handleResetFileName}
                handleSaveFileName={callSaveFileName}
            />

            <Box flexGrow={1} />

            <SelectFileRenderer />

            <ButtonGroup>
                <Button variant="outlined" href={"/api/browse/" + fileUrl}>
                    <ArrowCircleDown fontSize="small" />
                </Button>
                <Button variant="outlined" onClick={clearFileSelectionInCache}>
                    <Close fontSize="small" />
                </Button>
            </ButtonGroup>
        </Toolbar>
    );
};
