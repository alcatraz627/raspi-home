import React from 'react'
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"


export const Navbar = (): JSX.Element => {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{
                        flexGrow: 1,
                    }}>
                        Chopra Ras-pi Home
                    </Typography>
                    <Button variant="text" color="inherit">Button</Button>
                </Toolbar>
            </AppBar>
        </Box>)
}