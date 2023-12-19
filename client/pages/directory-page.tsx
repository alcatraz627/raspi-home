import {
    ArrowUpward,
    Cached,
    CreateNewFolder,
    Edit,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    createServerDirectory,
    createServerFile,
    readServerDirectory,
    renameServerFile,
} from "../api";
import { DirectoryPath } from "../components/directory-path/directory-path.component";
import { DirList } from "../components/directory/dir-list";
import { FilePreview } from "../components/file-preview/file-preview";
import { RouteMap } from "../routes";
import { useServerData } from "../utils/use-server-data/use-server-data";

export type NavigatePath = string | ((v: string) => string) | null;

export const DirectoryPage: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Will not have the leading slash
    const pathString = location.pathname.replace("/browse/", "");
    const setPathString = (newPath: string) => {
        navigate(RouteMap.browse.getPath(newPath));
    };

    useEffect(() => {
        fetchDirContents(pathString);
    }, [pathString]);

    const parsedPath = useMemo(() => {
        try {
            return pathString.split("/").filter((v) => v);
        } catch (error) {
            return [""];
        }
    }, [pathString]);

    const getFullPath = (fileName: string) =>
        parsedPath.concat(fileName).join("/");

    const currentFolderName =
        parsedPath?.[parsedPath.length - 1] || "Root Folder";

    const [filePathString, setFilePathString] = useState<string | null>(null);
    const [dirData, dirActions, dirStatus] = useServerData(readServerDirectory);

    const fetchDirContents = (path: string) => {
        dirActions.query(path);
    };

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

    const handleRefreshFolderContents = () => {
        fetchDirContents(pathString);
    };

    const handleCreateFolder = async () => {
        const folderName = prompt("Enter folder name", "Other");

        if (!folderName) return;

        const newFolderPath = parsedPath.concat(folderName).join("/");
        const resp = await createServerDirectory(newFolderPath);
        console.log(resp);

        handleRefreshFolderContents();
    };

    const handleRenameFolder = async () => {
        if (!pathString) return;
        const newFolderName = prompt(
            "Enter new folder name",
            currentFolderName
        );

        if (!newFolderName || newFolderName === pathString) return;

        const oldFolderPath = parsedPath.join("/");
        const newFolderPath = parsedPath
            .slice(0, -1)
            .concat(newFolderName)
            .join("/");
        await renameServerFile(oldFolderPath, newFolderPath);
        handleSelectFolder(newFolderPath);

        handleRefreshFolderContents();
    };

    const handleCreateFile = async () => {
        const newFileName = prompt("Enter new file name", Date.now() + ".txt");
        if (!newFileName) return;

        await createServerFile(getFullPath(newFileName));

        handleRefreshFolderContents();
    };

    return (
        <>
            <DirectoryPath
                parsedPath={parsedPath}
                handleSelectFolder={handleSelectFolder}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h4" sx={{ pl: 3 }}>
                {currentFolderName}
            </Typography>
            <Box sx={{ pl: 3 }}>
                <Tooltip title="Edit Dir Name">
                    <IconButton
                        onClick={handleRenameFolder}
                        size="small"
                        disabled={!pathString}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Create new folder">
                    <IconButton onClick={handleCreateFolder} size="small">
                        <CreateNewFolder fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Go to parent folder">
                    <IconButton
                        onClick={handleGoToParentFolder}
                        size="small"
                        disabled={!pathString}
                    >
                        <ArrowUpward fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Refresh folder contents">
                    <IconButton
                        onClick={handleRefreshFolderContents}
                        size="small"
                    >
                        <Cached fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box
                display="flex"
                width="100%"
                flexDirection="row"
                height="100%"
                flexGrow={1}
            >
                <DirList
                    pathList={parsedPath}
                    folders={dirData?.folders || []}
                    selectFile={handleSelectFile}
                    selectFolder={handleSelectFolder}
                    refreshFolderContents={handleRefreshFolderContents}
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
                    refreshFolderContents={handleRefreshFolderContents}
                    updateSelectedFile={handleSelectFile}
                    createNewFile={handleCreateFile}
                    rootStyle={{ width: "160%" }}
                />
            </Box>

            <Divider sx={{ my: 2 }} />
        </>
    );
};
