import { Delete, InsertDriveFile, OpenInNew } from "@mui/icons-material";
import {
    Box,
    Divider,
    IconButton,
    List,
    SxProps,
    Theme,
    Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import { DirListItem, DirListItemProps } from "./dir-list-item";
import { NavigatePath } from "@/client/pages/directory-page";

export interface DirListProps {
    pathList: string[];

    folders: string[];
    selectFolder: (newPath: NavigatePath) => void;

    files: string[];
    selectFile: (newPath: NavigatePath) => void;

    rootStyle?: SxProps<Theme>;
}

export const DirList: FunctionComponent<DirListProps> = ({
    pathList,
    folders = [],
    selectFile,
    selectFolder,
    files = [],
    rootStyle,
}) => {
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
                <DirListItem
                    key={dir}
                    primaryElement={dir}
                    primaryAction={() => {
                        selectFolder((p) => p + "/" + dir);
                    }}
                    secondaryAction={
                        <IconButton edge="end">
                            <Delete fontSize="small" />
                        </IconButton>
                    }
                />
            ))}

            <Divider />

            {files.map((f) => (
                <DirListItem
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
                                onClick={() => {
                                    const filePath =
                                        pathList.join("/") + "/" + f;
                                    window.open(filePath, "_blank");
                                }}
                            >
                                <OpenInNew fontSize="small" />
                            </IconButton>
                            &nbsp;
                            <IconButton edge="end">
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>
                    }
                />
            ))}
        </List>
    );
};
