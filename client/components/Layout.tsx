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
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <Navbar />
                <Container
                    maxWidth="xl"
                    sx={{
                        pt: 2,
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                    }}
                >
                    {children}
                </Container>
            </Box>
        </ThemeProvider>
    );
};
