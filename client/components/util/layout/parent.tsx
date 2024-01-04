import { Box, Container, ThemeProvider } from "@mui/material";
import { createContext } from "react";
import { Navbar } from "./navbar";
import { theme } from "../../../style/theme";
import { NotifyProvider } from "../../../utils/use-notify/notify-provider.component";
import { NotifyDisplay } from "../../../utils/use-notify/notify-display.component";
import {
    GlobalContext,
    UseGlobalReturn,
    useInitGlobalState,
} from "../../../utils/use-global/use-global";

export const Layout = ({
    children,
}: {
    children: JSX.Element;
}): JSX.Element => {
    const globalState = useInitGlobalState();

    return (
        <ThemeProvider theme={theme}>
            <GlobalContext.Provider value={globalState}>
                <NotifyProvider>
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
                    <NotifyDisplay />
                </NotifyProvider>
            </GlobalContext.Provider>
        </ThemeProvider>
    );
};
