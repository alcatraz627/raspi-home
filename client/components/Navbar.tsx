import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { RouteMap } from "../routes";

export const Navbar = (): JSX.Element => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        Chopra Ras-pi Home
                    </Typography>
                    {Object.values(RouteMap).map((route) => (
                        <Button
                            key={route.key}
                            variant="text"
                            color="inherit"
                            href={route.path}
                            sx={{
                                textTransform: "capitalize"
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
