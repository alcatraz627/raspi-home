import { RouteKey, RouteMap } from "@/client/routes";
import { useIsMobile, useMounted } from "@/client/utils/hooks";
import MenuIcon from "@mui/icons-material/Menu";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import { useGlobal } from "../../../utils/use-global/use-global";

export const Navbar = (): JSX.Element => {
    const {
        values: { isDrawerOpen = false },
        setValue,
    } = useGlobal();
    const isMobile = useIsMobile();

    const isMounted = useMounted();

    const setIsDrawerOpen = (o: boolean) => setValue("isDrawerOpen", o);

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    {isMounted && isMobile && (
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
                        component="a"
                        sx={{
                            flexGrow: 1,
                            textDecoration: "none",
                            color: "primary.contrastText",
                        }}
                        href={RouteMap.home.getPath()}
                    >
                        Ras-pi Home
                    </Typography>
                    {Object.values(RouteMap)
                        .reverse()
                        .filter((route) => route.key !== RouteKey.home)
                        .map((route) => (
                            <Button
                                key={route.key}
                                variant="text"
                                color="inherit"
                                href={route.getPath("")}
                                sx={{
                                    textTransform: "capitalize",
                                }}
                                size={isMobile ? "small" : "medium"}
                            >
                                {route.key}
                            </Button>
                        ))}
                </Toolbar>
            </AppBar>
        </Box>
    );
};
