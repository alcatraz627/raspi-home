import {
    Box,
    BoxProps,
    CircularProgress,
    CircularProgressProps,
} from "@mui/material";
import { FunctionComponent } from "react";

export interface LoaderProps extends CircularProgressProps {
    rootProps?: BoxProps;
    fullWidth?: boolean;
    disablePadding?: boolean;
}

export const Loader: FunctionComponent<LoaderProps> = ({
    rootProps,
    fullWidth,
    disablePadding,
    ...progressBarProps
}) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p={disablePadding ? 0 : 24}
            width={fullWidth ? "initial" : "fit-content"}
            {...rootProps}
        >
            <CircularProgress size={64} thickness={1} {...progressBarProps} />
        </Box>
    );
};
