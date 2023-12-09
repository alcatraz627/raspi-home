import { createTheme } from "@mui/material/styles";
import { green, pink, red } from "@mui/material/colors";
import { Variant } from "@mui/material/styles/createTypography";

const TitleFont = "Comfortaa, sans-serif";
const TextFont = "Open Sans, sans-serif";

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
            variants: [
                {
                    props: { variant: "h1" },
                    style: {
                        fontFamily: TitleFont,
                        fontSize: 56,
                    },
                },
                {
                    props: { variant: "h2" },
                    style: {
                        fontFamily: TitleFont,
                        fontSize: 48,
                    },
                },
                {
                    props: { variant: "h3" },
                    style: {
                        fontFamily: TitleFont,
                        fontSize: 36,
                    },
                },
                {
                    props: { variant: "h4" },
                    style: {
                        fontFamily: TitleFont,
                        fontSize: 24,
                    },
                },
                {
                    props: { variant: "h5" },
                    style: {
                        fontFamily: TitleFont,
                        fontSize: 20,
                    },
                },
                {
                    props: { variant: "h6" },
                    style: {
                        fontFamily: TitleFont,
                        fontSize: 18,
                    },
                },
                {
                    props: { variant: "subtitle1" },
                    style: {
                        textTransform: "uppercase",
                    },
                },
                {
                    props: { variant: "body1" },
                    style: {},
                },
                {
                    props: { variant: "subtitle2" },
                    style: {
                        textTransform: "uppercase",
                    },
                },
                {
                    props: { variant: "body2" },
                    style: {},
                },
                {
                    props: { variant: "button" },
                    style: {
                        fontFamily: TitleFont,
                        textTransform: "none",
                        letterSpacing: 0.2,
                        fontSize: 16,
                    },
                },
            ],
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: TitleFont,
                    textTransform: "none",
                    letterSpacing: 0.2,
                    fontSize: 16,
                    borderRadius: 1000000,
                },
                sizeSmall: {
                    fontSize: 13,
                },
                sizeLarge: {
                    fontSize: 18,
                },
                contained: {
                    boxShadow: "none",
                },
            },
        },
    },
});
