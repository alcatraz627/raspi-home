import { Box, Divider, SwipeableDrawer } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    createServerDirectory,
    createServerFile,
    readServerDirectory,
    renameServerFile,
} from "../api";
import { DirectoryPathBreadcrumbs } from "../components/directory/directory-path-breadcrumbs.component";
import {
    DirectoryList,
    DirectoryListProps,
} from "../components/directory/directory-list/directory-list";
import {
    FilePreview,
    FilePreviewProps,
} from "../components/files/file-preview";
import { RouteMap } from "../routes";
import { useServerData } from "../utils/use-server-data/use-server-data";
import { useGlobal } from "../utils/use-global/use-global";
import {
    DirectoryTitle,
    DirectoryTitleProps,
} from "../components/directory/directory-title.component";
import { useIsMobile } from "../utils/hooks";

export type NavigatePath = string | ((v: string) => string) | null;

export const DirectoryPage: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useIsMobile();

    const {
        values: { isDrawerOpen },
        setValue,
    } = useGlobal();

    const setIsDrawerOpen = (o: boolean) => setValue("isDrawerOpen", o);

    // Will not have the leading slash
    const pathString = decodeURIComponent(
        location.pathname.replace("/browse/", "")
    );
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

    const currentFolderName = decodeURIComponent(
        parsedPath?.[parsedPath.length - 1] || "Root Folder"
    );

    const [filePathString, setFilePathString] = useState<string | null>(null);
    const [dirData, dirActions] = useServerData(readServerDirectory);

    const fetchDirContents = (path: string) => {
        console.log(path);
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

    const directoryTitleProps: DirectoryTitleProps = {
        currentFolderName,
        pathString,
        handleCreateFolder,
        handleGoToParentFolder,
        handleRefreshFolderContents,
        handleRenameFolder,
    };

    const directoryListProps: DirectoryListProps = {
        pathList: parsedPath,
        folders: dirData?.folders || [],
        selectFile: handleSelectFile,
        selectFolder: handleSelectFolder,
        refreshFolderContents: handleRefreshFolderContents,
        files: dirData?.files || [],
        rootStyle: {},
    };

    const filePreviewProps: FilePreviewProps = {
        fileUrl: filePathString,
        refreshFolderContents: handleRefreshFolderContents,
        updateSelectedFile: handleSelectFile,
        createNewFile: handleCreateFile,

        rootStyle: {},
    };

    if (isMobile) {
        return (
            <>
                <div>
                    <SwipeableDrawer
                        anchor="left"
                        open={isDrawerOpen}
                        onOpen={() => setIsDrawerOpen(true)}
                        onClose={() => setIsDrawerOpen(false)}
                    >
                        <Box pt={isMobile ? 2 : 3}>
                            <DirectoryPathBreadcrumbs
                                parsedPath={parsedPath}
                                handleSelectFolder={handleSelectFolder}
                            />
                            <DirectoryTitle {...directoryTitleProps} />
                        </Box>
                        <DirectoryList
                            {...directoryListProps}
                            rootStyle={{
                                width: "clamp(100px, 70vw, 300px)",
                            }}
                        />
                    </SwipeableDrawer>
                </div>
                <FilePreview {...filePreviewProps} />
                {!filePathString && (
                    <>
                        <Box py={2}>
                            <Divider sx={{ mx: -2, my: 0 }} />
                        </Box>
                        <DirectoryTitle {...directoryTitleProps} />
                        <DirectoryList {...directoryListProps} />
                    </>
                )}
            </>
        );
    }

    return (
        <Box>
            <DirectoryPathBreadcrumbs
                parsedPath={parsedPath}
                handleSelectFolder={handleSelectFolder}
            />
            <Divider sx={{ my: 2 }} />
            <DirectoryTitle {...directoryTitleProps} />
            <Box
                display="flex"
                width="100%"
                flexDirection="row"
                height="100%"
                flexGrow={1}
            >
                <DirectoryList
                    {...directoryListProps}
                    rootStyle={{ width: "40%" }}
                />
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ mr: 4, mt: 1 }}
                />
                <FilePreview
                    {...filePreviewProps}
                    rootStyle={{ width: "160%" }}
                />
            </Box>
            <Divider sx={{ my: 2 }} />
        </Box>
    );
};
