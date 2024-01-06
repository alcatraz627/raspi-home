import { Box, BoxProps, Typography } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

export interface PageMessageProps extends BoxProps {
    children?: string | ReactNode;
    fullWidth?: boolean;
    disablePadding?: boolean;
}

export const PageMessage: FunctionComponent<PageMessageProps> = ({
    fullWidth,
    disablePadding,
    children,
    ...rootProps
}) => {
    const renderChild = () => {
        if (typeof children === "string") {
            return <Typography variant="h4">{children}</Typography>;
        }

        return children;
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p={disablePadding ? 0 : 24}
            width={fullWidth ? "initial" : "fit-content"}
            {...rootProps}
        >
            {renderChild()}
        </Box>
    );
};
