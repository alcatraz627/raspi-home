import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

export interface MessageProps extends BoxProps {
    children?: string | ReactNode;
    fullWidth?: boolean;
    disablePadding?: boolean;
    variant?: TypographyProps["variant"];
}

export const Message: FunctionComponent<MessageProps> = ({
    fullWidth,
    disablePadding,
    children,
    variant = "h4",
    ...rootProps
}) => {
    const renderChild = () => {
        if (typeof children === "string") {
            return <Typography variant={variant}>{children}</Typography>;
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
