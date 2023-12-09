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

export interface DirListItemProps {
    primaryElement?: ReactNode;
    helperElement?: ReactNode;

    PrimaryIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    primaryAction?: () => void;
    avatarVariant?: "rounded" | "circular";
    avatarBgColor?: string;

    SecondaryIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    secondaryAction?: () => void;
}

export const DirListItem: FunctionComponent<DirListItemProps> = ({
    primaryElement,
    helperElement,
    primaryAction,
    PrimaryIcon = Folder,
    avatarVariant = "rounded",
    avatarBgColor,

    secondaryAction,
    SecondaryIcon,
}) => {
    return (
        <ListItem
            secondaryAction={
                SecondaryIcon ? (
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={secondaryAction}
                    >
                        <SecondaryIcon fontSize="small" />
                    </IconButton>
                ) : null
            }
        >
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
