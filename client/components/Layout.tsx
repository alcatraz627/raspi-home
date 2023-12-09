import { Box, Container, ThemeProvider } from "@mui/material";
import React from "react";
import { Navbar } from "./navbar";
import { theme } from "../style/theme";

export const Layout = ({
    children,
}: {
    children: JSX.Element;
}): JSX.Element => {
    return (
        <ThemeProvider theme={theme}>
            <Box>
                <Navbar />
                <Container maxWidth="xl" sx={{ pt: 2 }}>
                    {children}
                </Container>
            </Box>
        </ThemeProvider>
    );
};
