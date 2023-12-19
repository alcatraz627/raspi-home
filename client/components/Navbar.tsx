import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { RouteMap } from "../routes";

export const Navbar = (): JSX.Element => {
    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="a"
                        sx={{
                            flexGrow: 1,
                            textDecoration: "none",
                            color: "primary.contrastText",
                        }}
                        href={RouteMap.home.getPath()}
                    >
                        Chopra Ras-pi Home
                    </Typography>
                    {Object.values(RouteMap)
                        .reverse()
                        .map((route) => (
                            <Button
                                key={route.key}
                                variant="text"
                                color="inherit"
                                href={route.getPath("")}
                                sx={{
                                    textTransform: "capitalize",
                                }}
                            >
                                {route.key}
                            </Button>
                        ))}
                </Toolbar>
            </AppBar>
        </Box>
    );
};
