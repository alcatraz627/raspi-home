import { useIsMobile, useMounted } from "@/client/utils/hooks";
import MenuIcon from "@mui/icons-material/Menu";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import { useGlobal } from "../../../utils/use-global/use-global";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { RouteMap, RouteKey } from "@/client/routes/routes.utils";

export const Navbar = (): JSX.Element => {
    const { setValue } = useGlobal();
    const isMobile = useIsMobile();
    const isMounted = useMounted();
    const currentPath = useMemo(() => {
        if (!isMounted) return null;

        let initialPath = window.location.pathname;
        if (!initialPath.endsWith("/")) {
            initialPath += "/";
        }

        const match = Object.values(RouteMap).find(({ getPath }) =>
            initialPath.startsWith(getPath(""))
        );

        return match;
    }, [isMounted]);

    const setIsDrawerOpen = (o: boolean) => setValue("isDrawerOpen", o);

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    {isMounted &&
                        isMobile &&
                        currentPath?.pageOptions?.showDrawer && (
                            <IconButton
                                color="inherit"
                                onClick={() => setIsDrawerOpen(true)}
                                edge="start"
                                size="small"
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    <Typography
                        variant={isMobile ? "body2" : "h6"}
                        component={Link}
                        sx={{
                            textDecoration: "none",
                            color: "primary.contrastText",
                            marginLeft: isMobile ? 2 : 0,
                        }}
                        to={RouteMap.home.getPath()}
                    >
                        Ras-pi Home
                    </Typography>
                    <Box flexGrow={1} />
                    {Object.values(RouteMap)
                        .reverse()
                        .filter((route) => route.key !== RouteKey.home)
                        .map(({ Icon, key, getPath }) =>
                            isMobile && Icon ? (
                                <Tooltip key={key} title={key}>
                                    <IconButton
                                        color="inherit"
                                        size="small"
                                        to={getPath("")}
                                        component={Link}
                                    >
                                        <Icon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Button
                                    key={key}
                                    variant="text"
                                    color="inherit"
                                    href={getPath("")}
                                    sx={{
                                        textTransform: "capitalize",
                                    }}
                                    startIcon={Icon ? <Icon /> : null}
                                >
                                    {isMobile ? null : key}
                                </Button>
                            )
                        )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};
