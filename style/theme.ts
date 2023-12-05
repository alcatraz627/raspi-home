import { createTheme } from "@mui/material/styles"
import { green, pink, red } from "@mui/material/colors"
import { Variant } from "@mui/material/styles/createTypography"

const TitleFont = "Comfortaa, sans-serif"
const TextFont = "Open Sans, sans-serif"

// Create a theme instance.
export const theme = createTheme({
    palette: {
        primary: {
            main: green[600],
        },
        secondary: {
            main: pink[400],
        },
        error: {
            main: red["A400"],
        },
    },
    typography: {
        fontFamily: TextFont,
    },
    components: {
        MuiTypography: {
            variants: (["h1", "h2", "h3", "h4", "h5", "h6"] as Variant[]).map(
                (h) => ({
                    props: { variant: h },
                    style: {
                        fontFamily: TitleFont,
                    },
                })
            ),
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: TitleFont,
                    textTransform: "none",
                    letterSpacing: 0.2,
                    fontSize: 16,
                },
                sizeSmall: {
                    fontSize: 13,
                },
                sizeLarge: {
                    fontSize: 18,
                },
            },
        },
    },
})
