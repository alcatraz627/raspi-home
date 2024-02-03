import {
    createServerFile,
    deleteServerDirectory,
    deleteServerFile,
    getApiUrl,
    renameServerDirectory,
} from "@/client/api";
import { NavigatePath } from "@/client/pages/directory-page";
import { useNotify } from "@/client/utils/use-notify/notify-provider.component";
import {
    AddCircleOutline,
    Close,
    Delete,
    Edit,
    InsertDriveFile,
    OpenInNew,
    Search,
    Upload,
} from "@mui/icons-material";
import {
    Box,
    Divider,
    IconButton,
    Input,
    InputAdornment,
    List,
    SxProps,
    Theme,
    Typography,
} from "@mui/material";
import { FunctionComponent, useMemo, useState } from "react";
import { Message } from "../util/common/message.components";
import { DirectoryListItem } from "./directory-list-item";
import { useDropzone } from "react-dropzone";
import { TFile, UploadFileProps } from "../util/elements/upload-file";
import { RouteMap } from "@/client/routes/routes.utils";
import { useIsMobile } from "@/client/utils/hooks";
import { FsAction, FsObject } from "@/server/routes/api/constants";

export interface DirectoryListProps {
    pathList: string[];
    rootStyle?: SxProps<Theme>;
    folders: string[];
    files: string[];
    selectFolder: (newPath: NavigatePath) => void;
    selectFile: (newPath: NavigatePath) => void;
    refreshFolderContents: () => void;
    uploadFile: UploadFileProps["uploadFile"];
    listMaxHeight?: string;
}

export const DirectoryList: FunctionComponent<DirectoryListProps> = ({
    pathList,
    folders = [],
    selectFile,
    selectFolder,
    refreshFolderContents,
    uploadFile,
    files = [],
    rootStyle,
    listMaxHeight,
}) => {
    const { notify } = useNotify();
    const isMobile = useIsMobile();
    const [search, setSearch] = useState<string>("");

    const getFullPath = (fileName?: string) =>
        (fileName ? pathList.concat(fileName) : pathList).join("/");

    const handleUpload = async (uploadedFileProp: TFile | undefined) => {
        if (uploadedFileProp) {
            try {
                await uploadFile([uploadedFileProp]);
                notify({ message: "File uploaded successfully" });
            } catch (err) {
                console.error(err);
                notify({ message: "Error: " + err });
            }
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        onDrop: async (acceptedFiles) => {
            const uploadedFile = acceptedFiles[0] as unknown as
                | TFile
                | undefined;

            if (uploadedFile) {
                handleUpload(uploadedFile);
            }
        },
    });

    const handleDeleteFile = async (fileName: string): Promise<void> => {
        if (!confirm(`Delete this file ${fileName}?`)) return;

        const filePath = getFullPath(fileName);
        await deleteServerFile(filePath);

        // here
        refreshFolderContents();
        notify({ message: `${fileName} deleted` });

        selectFile(null);
    };

    const handleDeleteFolder = async (folderName: string): Promise<void> => {
        if (!confirm(`Delete this folder ${folderName}?`)) return;

        const filePath = getFullPath(folderName);
        await deleteServerDirectory(filePath);
        refreshFolderContents();

        notify({ message: `${folderName} deleted` });
    };

    const handleRenameFolder = async (folderName: string): Promise<void> => {
        const folderPath = getFullPath(folderName);

        const newFolderName = prompt("New Folder Name", folderName);
        if (!newFolderName || newFolderName === folderName) return;
        const newFolderPath = getFullPath(newFolderName);

        await renameServerDirectory(folderPath, newFolderPath);
        refreshFolderContents();

        notify({ message: `${folderName} renamed to ${newFolderName}` });
    };

    const handleOpenFileInNewTab = (fileName: string): void => {
        const filePath = getFullPath(fileName);
        const openFilePath = getApiUrl(FsAction.Read, FsObject.File, filePath);

        window.open(openFilePath, "_blank");
    };

    const handleCreateFile = async () => {
        const newFileName = prompt("New File Name", Date.now() + ".txt");
        if (!newFileName) return;

        await createServerFile(getFullPath(newFileName));
        refreshFolderContents();

        notify({ message: `${newFileName} created` });
    };

    const filtered = useMemo<{ files: string[]; folders: string[] }>(() => {
        if (search === "") return { files, folders };

        const searchedFiles = files.filter((f) =>
            f.toLowerCase().includes(search.toLowerCase())
        );
        const searchedFolders = folders.filter((f) =>
            f.toLowerCase().includes(search.toLowerCase())
        );

        return { files: searchedFiles, folders: searchedFolders };
    }, [folders, files, search]);

    const SearchInDirectoryList = () => (
        <Input
            sx={{
                ml: 4,
                mb: 2,
                width: "calc(100% - 48px)",
                top: 0,
                position: "sticky",
                bgcolor: "white",
                zIndex: 1,
            }}
            startAdornment={
                <InputAdornment position="start">
                    <Search />
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position="start">
                    <IconButton
                        onClick={() => {
                            setSearch("");
                        }}
                        sx={{
                            mr: -2,
                        }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </InputAdornment>
            }
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    );

    return (
        <List
            disablePadding={true}
            sx={{
                width: "100%",
                overflow: "auto",
                ...rootStyle,
            }}
        >
            <SearchInDirectoryList />
            {folders.length === 0 && files.length === 0 && (
                <Typography
                    variant="body2"
                    sx={{
                        opacity: 0.5,
                        py: 2,
                        textAlign: "center",
                    }}
                >
                    No data
                </Typography>
            )}
            <Box
                sx={{
                    minHeight: "-webkit-fill-available",
                    maxHeight:
                        listMaxHeight ??
                        (isMobile
                            ? "calc(100dvh - 320px)"
                            : "calc(100dvh - 400px)"),
                    overflow: "auto",
                }}
            >
                {filtered.folders.map((dir) => (
                    <DirectoryListItem
                        key={dir}
                        primaryElement={dir}
                        primaryAction={() => {
                            selectFolder((p) => p + "/" + dir);
                        }}
                        secondaryAction={
                            <Box>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleRenameFolder(dir)}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                &nbsp;
                                <IconButton
                                    edge="end"
                                    onClick={() => handleDeleteFolder(dir)}
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Box>
                        }
                    />
                ))}
                <Divider />
                {filtered.files.map((f) => (
                    <DirectoryListItem
                        key={f}
                        avatarVariant="circular"
                        primaryElement={f}
                        primaryAction={() => {
                            selectFile((p) => p + "/" + f);
                        }}
                        PrimaryIcon={InsertDriveFile}
                        secondaryAction={
                            <Box>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleOpenFileInNewTab(f)}
                                >
                                    <OpenInNew fontSize="small" />
                                </IconButton>
                                &nbsp;
                                <IconButton
                                    edge="end"
                                    onClick={() => handleDeleteFile(f)}
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Box>
                        }
                    />
                ))}
                {filtered.folders.length === 0 &&
                    filtered.files.length === 0 && (
                        <Message
                            variant="body2"
                            py={4}
                            px={2}
                            mx="auto"
                            color="grey.500"
                        >
                            No results found
                        </Message>
                    )}
            </Box>
            <Divider />
            <DirectoryListItem
                avatarVariant="circular"
                avatarBgColor="primary.light"
                primaryElement={"New File"}
                primaryAction={handleCreateFile}
                PrimaryIcon={AddCircleOutline}
            />
            <Box {...getRootProps()}>
                <DirectoryListItem
                    avatarVariant="circular"
                    avatarBgColor="primary.light"
                    primaryElement={"Upload File"}
                    PrimaryIcon={Upload}
                />
                <input {...getInputProps()} />
            </Box>
        </List>
    );
};
