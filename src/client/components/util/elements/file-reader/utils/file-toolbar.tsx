import { ArrowCircleDown, Close } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Toolbar, Typography } from "@mui/material";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { FileName } from "./file-name";
import { FileType } from "./utils";

export interface FileToolbarProps {
    fileType: FileType;
    fileUrl: string | null;
    SelectFileRenderer: FunctionComponent;
    FileNameRenderer: FunctionComponent;

    clearFileSelectionInCache: () => void;
}

export const FileToolbar: FunctionComponent<FileToolbarProps> = ({
    fileType,
    fileUrl,
    SelectFileRenderer,
    FileNameRenderer,
    clearFileSelectionInCache,
}) => {
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

            <FileNameRenderer />

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
