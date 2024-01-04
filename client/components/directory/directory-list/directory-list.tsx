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
    Delete,
    Edit,
    InsertDriveFile,
    OpenInNew,
} from "@mui/icons-material";
import {
    Box,
    Button,
    Divider,
    IconButton,
    List,
    SxProps,
    Theme,
    Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import { DirectoryListItem } from "./directory-list-item";

export interface DirectoryListProps {
    pathList: string[];

    folders: string[];
    selectFolder: (newPath: NavigatePath) => void;

    files: string[];
    selectFile: (newPath: NavigatePath) => void;

    rootStyle?: SxProps<Theme>;
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

    return (
        <List
            sx={{
                width: "100%",
                ...rootStyle,
            }}
        >
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
            {folders.map((dir) => (
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

            {files.map((f) => (
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