import { Delete, InsertDriveFile } from "@mui/icons-material";
import { Divider, List } from "@mui/material";
import { FunctionComponent } from "react";
import { DirListItem, DirListItemProps } from "./dir-list-item";

export interface DirListProps {
    pathList: string[];

    folders: string[];
    selectFolder: (
        newPath: string | ((oldPath: string) => string) | null
    ) => void;

    files: string[];
    selectFile: (
        newPath: string | ((oldPath: string) => string) | null
    ) => void;
}

export const DirList: FunctionComponent<DirListProps> = ({
    pathList,
    folders,
    selectFile,
    selectFolder,
    files,
}) => {
    return (
        <List
            sx={{
                // flex: 1,
                width: "30%",
            }}
        >
            <DirListItem
                primaryElement={".."}
                primaryAction={() => {
                    selectFolder([...pathList].slice(0, -1).join("/"));
                }}
            />
            <Divider />

            {(folders || []).map((dir) => (
                <DirListItem
                    key={dir}
                    primaryElement={dir}
                    primaryAction={() => {
                        selectFolder((p) => p + "/" + dir);
                    }}
                    SecondaryIcon={Delete}
                />
            ))}

            <Divider />

            {(files || []).map((f) => (
                <DirListItem
                    key={f}
                    avatarVariant="circular"
                    primaryElement={f}
                    primaryAction={() => {
                        selectFile((p) => p + "/" + f);
                    }}
                    PrimaryIcon={InsertDriveFile}
                    SecondaryIcon={Delete}
                />
            ))}
        </List>
    );
};
