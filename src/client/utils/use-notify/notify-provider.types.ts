import { SnackbarProps } from "@mui/material";

export type Notification = SnackbarProps;

export interface CreatedNotification extends Notification {
    id: string;
}

export interface NotifyContextProps {
    notification: CreatedNotification | null;
    notify: (content: Notification) => void;
    clearNotification: () => void;
}
