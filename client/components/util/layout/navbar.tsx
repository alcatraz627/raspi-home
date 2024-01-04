import React, { useEffect, useState } from "react";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuPaper,
    SwipeableDrawer,
    Toolbar,
    Typography,
} from "@mui/material";
import { RouteMap } from "../../../routes";
import { useGlobal } from "../../../utils/use-global/use-global";
import MenuIcon from "@mui/icons-material/Menu";

export const Navbar = (): JSX.Element => {
    const {
        values: { isDrawerOpen = false },
        setValue,
    } = useGlobal();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const setIsDrawerOpen = (o: boolean) => setValue("isDrawerOpen", o);

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={() => setIsDrawerOpen(true)}
                        edge="start"
                    >
                        {isMounted && <MenuIcon />}
                    </IconButton>
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
