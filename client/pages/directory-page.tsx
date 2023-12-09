import { ArrowUpward } from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    Input,
    Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { fetchServerDirectory } from "../api";
import { DirList } from "../components/directory/dir-list";
import { FilePreview } from "../components/file-preview/file-preview";
import { useServerData } from "../utils/use-server-data/use-server-data";
import { ServerBreadcrumbs } from "../components/server-breadcrumbs/server-breadcrumbs.component";
import { DirectoryPath } from "../components/directory-path/directory-path.component";

export type NavigatePath = string | ((v: string) => string) | null;

export const DirectoryPage: React.FunctionComponent = () => {
    const [pathString, setPathString] = useState<string>("");
    const [filePathString, setFilePathString] = useState<string | null>(null);

    const [dirData, dirActions, dirStatus] =
        useServerData(fetchServerDirectory);

    const parsedPath = useMemo(() => {
        try {
            return pathString.split("/").filter((v) => v);
        } catch (error) {
            return [""];
        }
    }, [pathString]);

    const fetchDirContents = (path: string) => {
        dirActions.query(path);
    };

    useEffect(() => {
        fetchDirContents(pathString);
    }, []);

    const handleSelectFile = (newPath: NavigatePath): void => {
        const parsedNewPath =
            (typeof newPath === "function" ? newPath(pathString) : newPath) ||
            null;

        setFilePathString(parsedNewPath);
    };
    const handleSelectFolder = (newPath: NavigatePath): void => {
        const parsedNewPath =
            (typeof newPath === "function" ? newPath(pathString) : newPath) ||
            "";

        setPathString(parsedNewPath);
        fetchDirContents(parsedNewPath);
    };

    const handleGoToParentFolder = () => {
        handleSelectFolder([...parsedPath].slice(0, -1).join("/"));
    };

    return (
        <div>
            <DirectoryPath
                parsedPath={parsedPath}
                handleSelectFolder={handleSelectFolder}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h4" sx={{ pl: 3 }}>
                Directory
                <IconButton onClick={handleGoToParentFolder}>
                    <ArrowUpward />
                </IconButton>
            </Typography>
            <Box
                display="flex"
                width="100%"
                flexDirection="row"
                height="100%"
                flexGrow={1}
            >
                <DirList
                    pathList={parsedPath}
                    folders={dirData?.directories || []}
                    selectFile={handleSelectFile}
                    selectFolder={handleSelectFolder}
                    files={dirData?.files || []}
                    rootStyle={{ width: "40%" }}
                />
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ mr: 4, mt: 1 }}
                />
                <FilePreview
                    fileUrl={filePathString}
                    rootStyle={{ width: "160%" }}
                />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* <pre>{JSON.stringify(filePathString)}</pre> */}
        </div>
    );
};
