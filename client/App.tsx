import { Button, ThemeProvider } from "@mui/material"
import { Navbar } from "./Navbar"
import { theme } from "../style/theme"

export const App = (): JSX.Element => {

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Navbar />
                App with ssr and mui
                <Button>Button</Button>
            </div>
        </ThemeProvider>)
}