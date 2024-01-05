import { Box, Snackbar } from "@mui/material";
import { FunctionComponent } from "react";
import { useNotify } from "./notify-provider.component";

export const NotifyDisplay: FunctionComponent = () => {
    const { notification } = useNotify();
    if (!notification) return null;
    return (
        <Box>
            <Snackbar {...notification} key={notification.id} open={true} />
        </Box>
    );
};
