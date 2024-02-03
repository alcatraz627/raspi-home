import { Box, Divider, SwipeableDrawer } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    createServerDirectory,
    createServerFile,
    readServerDirectory,
    renameServerFile,
} from "../api";
import {
    DirectoryList,
    DirectoryListProps,
} from "../components/directory/directory-list";
import { DirectoryPathBreadcrumbs } from "../components/directory/breadcrumbs/directory-path-breadcrumbs";
import {
    DirectoryTitle,
    DirectoryTitleProps,
} from "../components/directory/directory-title.component";
import {
    ReadFileWrapper,
    ReadFileWrapperProps,
} from "../components/util/elements/file-reader/read-file-wrapper";
import { TFile } from "../components/util/elements/upload-file";
import { useIsMobile } from "../utils/hooks";
import { useDirectoryState } from "../utils/use-directory-state/use-directory-state";
import {
    QueryKeys,
    useQueryParamKey,
} from "../utils/use-directory-state/use-query-param";
import { useGlobal } from "../utils/use-global/use-global";
import { useServerData } from "../utils/use-server-data/use-server-data";
import { RouteMap } from "../routes/routes.utils";
import { PathBreadcrumbs } from "../components/util/elements/path-breadcrumbs";

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
    const [pathString, setPathString] = [
        decodeURIComponent(location.pathname.replace("/browse/", "")),
        (newPath: string) => {
            navigate(RouteMap.browse.getPath(newPath));
        },
    ];

    const [queryFileName, setQueryFileName, resetQueryFileName] =
        useQueryParamKey(QueryKeys.Filename);

    const [dirState, setDirState] = useDirectoryState();
    const cachedDirProperties = dirState[pathString];
    const lastOpenedFile = cachedDirProperties?.lastOpenFile ?? null;

    const [filePathString, setFilePathString] = useState<string | null>(null);

    // Parse out filename from url
    const parsedFileName = useMemo(() => {
        if (filePathString) {
            return filePathString.split("/").pop() ?? null;
        }

        return null;
    }, [filePathString]);

    // When the filepath string changes, update the name into the URL
    useEffect(() => {
        if (filePathString) {
            const newParsedFileName = filePathString.split("/").pop() || "";
            setQueryFileName(newParsedFileName);
        } else {
            resetQueryFileName();
        }
    }, [filePathString]);

    // If a query param is passed for an initial opening, load it into the File Path
    // Else, try to fetch from local storage
    useEffect(() => {
        if (queryFileName) {
            setFilePathString(getFullPath(queryFileName));
            return;
        }
        if (lastOpenedFile) {
            setQueryFileName(lastOpenedFile);
            setFilePathString(getFullPath(lastOpenedFile));
        }
    }, []);

    // Save the latest open file into local storage
    useEffect(() => {
        setDirState(pathString, { lastOpenFile: parsedFileName });
    }, [parsedFileName]);

    // When loading a folder, fetch its contents and load the last opened file
    useEffect(() => {
        fetchDirContents(pathString);
        if (lastOpenedFile) {
            setFilePathString(getFullPath(lastOpenedFile));
        }
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

    const [dirData, dirActions] = useServerData(readServerDirectory);

    const fetchDirContents = (path: string) => {
        dirActions.query(path);
    };

    const handleSelectFile = (newPath: NavigatePath): void => {
        const parsedNewPath =
            (typeof newPath === "function" ? newPath(pathString) : newPath) ||
            null;

        setFilePathString(parsedNewPath);
        // setDirState(pathString, parsedNewPath);
    };

    const handleSelectFolder = (newPath: NavigatePath): void => {
        const parsedNewPath =
            (typeof newPath === "function" ? newPath(pathString) : newPath) ||
            "";

        // Reset the selected open file before the folder change so the new folder can open its last open file
        handleSelectFile(null);

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

    const handleUploadFile = async (files: TFile[]) => {
        if (!files.length) return;

        await Promise.allSettled([
            ...files.map((file) => {
                const newFileName = prompt(
                    "Enter file name",
                    file.name + (file.name.includes(".") ? "" : ".txt")
                );
                if (!newFileName) return Promise.resolve();

                const fileUploadData = new FormData();
                fileUploadData.append(`file`, file, newFileName);
                return createServerFile(
                    getFullPath(newFileName),
                    fileUploadData
                );
            }),
        ]);

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
        uploadFile: handleUploadFile,
        files: dirData?.files || [],
        rootStyle: {},
    };

    const filePreviewProps: ReadFileWrapperProps = {
        pathList: parsedPath,
        fileUrl: filePathString,
        refreshFolderContents: handleRefreshFolderContents,
        updateSelectedFileCache: handleSelectFile,
        createNewFile: handleCreateFile,
        uploadFile: handleUploadFile,

        rootStyle: {},
    };

    const MobileView = () => (
        <Box>
            <div>
                <SwipeableDrawer
                    anchor="left"
                    open={isDrawerOpen}
                    onOpen={() => setIsDrawerOpen(true)}
                    onClose={() => setIsDrawerOpen(false)}
                >
                    <Box pt={isMobile ? 2 : 3}>
                        <Box
                            sx={{
                                px: 3,
                                width: "clamp(100px, 70vw, 300px)",
                            }}
                        >
                            <PathBreadcrumbs
                                parsedPath={parsedPath}
                                selectFolder={handleSelectFolder}
                            />
                        </Box>{" "}
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
            <ReadFileWrapper {...filePreviewProps} />
            {!filePathString && (
                <>
                    <Box py={2}>
                        <Divider sx={{ mx: -2, my: 0 }} />
                    </Box>
                    <DirectoryTitle {...directoryTitleProps} />
                    <DirectoryList
                        {...directoryListProps}
                        listMaxHeight="calc(100dvh - 540px)"
                    />
                </>
            )}
        </Box>
    );

    if (isMobile) {
        return <MobileView />;
    }

    return (
        <Box>
            <Box
                sx={{
                    px: 3,
                }}
            >
                <PathBreadcrumbs
                    parsedPath={parsedPath}
                    selectFolder={handleSelectFolder}
                />
            </Box>{" "}
            <Divider sx={{ my: 2 }} />
            <DirectoryTitle {...directoryTitleProps} />
            <Box
                display="flex"
                width="100%"
                flexDirection="row"
                height="100%"
                flexGrow={1}
                // alignItems="center"
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
                <ReadFileWrapper
                    {...filePreviewProps}
                    rootStyle={{ width: "160%" }}
                />
            </Box>
            <Divider sx={{ my: 2 }} />
        </Box>
    );
};
