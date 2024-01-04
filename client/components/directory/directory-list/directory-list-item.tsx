import { Folder } from "@mui/icons-material";
import {
    Avatar,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    SvgIconTypeMap,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { FunctionComponent, ReactNode } from "react";

export interface DirectoryListItemProps {
    primaryElement?: ReactNode;
    helperElement?: ReactNode;

    PrimaryIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    primaryAction?: () => void;
    avatarVariant?: "rounded" | "circular";
    avatarBgColor?: string;

    secondaryAction?: ReactNode;
}

export const DirectoryListItem: FunctionComponent<DirectoryListItemProps> = ({
    primaryElement,
    helperElement,
    primaryAction,
    PrimaryIcon = Folder,
    avatarVariant = "rounded",
    avatarBgColor,

    secondaryAction,
}) => {
    return (
        <ListItem secondaryAction={secondaryAction}>
            <ListItemButton onClick={primaryAction} dense>
                <ListItemAvatar>
                    <Avatar
                        variant={avatarVariant}
                        sx={{
                            ...(avatarBgColor && {
                                backgroundColor: avatarBgColor,
                            }),
                        }}
                    >
                        <PrimaryIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={primaryElement}
                    secondary={helperElement}
                />
            </ListItemButton>
        </ListItem>
    );
};
