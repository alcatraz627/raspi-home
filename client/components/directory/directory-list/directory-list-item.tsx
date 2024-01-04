import { Folder } from "@mui/icons-material";
import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    SvgIconTypeMap,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { FunctionComponent, ReactNode } from "react";
import { truncate } from "../../util/utils";

export interface DirectoryListItemProps {
    primaryElement?: string | ReactNode;
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
                    title={
                        typeof primaryElement === "string" ? primaryElement : ""
                    }
                    primary={truncate(primaryElement)}
                    secondary={helperElement}
                />
            </ListItemButton>
        </ListItem>
    );
};
