import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, {
    FunctionComponent,
    ReactNode,
    useContext,
    useState,
} from "react";
import {
    CreatedNotification,
    NotifyContextProps,
} from "./notify-provider.interfaces";

export const NotifyContext = React.createContext<NotifyContextProps>(
    {} as NotifyContextProps
);

export const NotifyProvider: FunctionComponent<{
    children: ReactNode;
    defaultAutoHideDuration?: number;
}> = ({ children, defaultAutoHideDuration = 5000 }) => {
    const [notification, setNotification] =
        useState<CreatedNotification | null>(null);

    const notify: NotifyContextProps["notify"] = (content) => {
        const created: CreatedNotification = {
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
            },
            ...content,
            id: Date.now().toString(),
            autoHideDuration:
                content?.autoHideDuration ?? defaultAutoHideDuration,
            onClose: (e, r) => {
                clearNotification();
                content?.onClose?.(e, r);
            },
        };

        if (!created.action) {
            created.action = (
                <IconButton
                    size="small"
                    color="inherit"
                    onClick={(e) => {
                        clearNotification();
                        content?.onClose?.(e, "escapeKeyDown");
                    }}
                >
                    <Close fontSize="small" />
                </IconButton>
            );
        }

        setNotification(created);
    };

    const clearNotification = () => {
        setNotification(null);
    };

    const notifyContextValue: NotifyContextProps = {
        notification,
        notify,
        clearNotification,
    };

    return (
        <NotifyContext.Provider value={notifyContextValue}>
            {children}
        </NotifyContext.Provider>
    );
};

export const useNotify = (): NotifyContextProps => useContext(NotifyContext);
