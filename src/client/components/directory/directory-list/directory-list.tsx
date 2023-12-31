import {
    createServerFile,
    deleteServerDirectory,
    deleteServerFile,
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
} from "@mui/icons-material";
import {
    Box,
    Divider,
    IconButton,
    List,
    Input,
    SxProps,
    Theme,
    Typography,
    InputAdornment,
} from "@mui/material";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { DirectoryListItem } from "./directory-list-item";
import { PageMessage } from "../../util/elements/page-message.components";

export interface DirectoryListProps {
    pathList: string[];
    rootStyle?: SxProps<Theme>;
    folders: string[];
    files: string[];
    selectFolder: (newPath: NavigatePath) => void;
    selectFile: (newPath: NavigatePath) => void;
    refreshFolderContents: () => void;
}

export const DirectoryList: FunctionComponent<DirectoryListProps> = ({
    pathList,
    folders = [],
    selectFile,
    selectFolder,
    refreshFolderContents,
    files = [],
    rootStyle,
}) => {
    const { notify } = useNotify();
    const [search, setSearch] = useState<string>("");

    const getFullPath = (fileName: string) =>
        pathList.concat(fileName).join("/");

    const handleDeleteFile = async (fileName: string): Promise<void> => {
        if (!confirm(`Delete this file ${fileName}?`)) return;

        const filePath = getFullPath(fileName);
        await deleteServerFile(filePath);

        refreshFolderContents();
        notify({ message: `${fileName} deleted` });
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
        window.open(filePath, "_blank");
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

    return (
        <List
            sx={{
                width: "100%",
                ...rootStyle,
            }}
        >
            <Input
                sx={{
                    ml: 4,
                    mb: 2,
                    width: "calc(100% - 48px)",
                }}
                startAdornment={
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position="start">
                        <IconButton
                            // size="small"
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

            {filtered.folders.length === 0 && filtered.files.length === 0 && (
                <PageMessage
                    variant="body2"
                    py={4}
                    px={2}
                    mx="auto"
                    color="grey.500"
                >
                    No results found
                </PageMessage>
            )}

            <DirectoryListItem
                avatarVariant="circular"
                avatarBgColor="primary.light"
                primaryElement={"New File"}
                primaryAction={handleCreateFile}
                PrimaryIcon={AddCircleOutline}
            />
        </List>
    );
};
