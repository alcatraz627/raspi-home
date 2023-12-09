import { Box, Checkbox, Container, Typography } from "@mui/material";
import React, { FunctionComponent } from "react";

export const HomePage: FunctionComponent = () => {
    const todoItems: { text?: string; done?: boolean }[] = [
        { text: "csv reader/writer" },
        { text: "spreadsheet ui" },
        { text: "file editor" },
        {
            text: "deployment",
        },
    ];

    return (
        <Box>
            <Typography variant="h4">To Do</Typography>

            {todoItems.map((t) => (
                <Box
                    key={t.text}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Checkbox checked={t.done} />
                    <Typography variant="body1">{t.text}</Typography>
                </Box>
            ))}
        </Box>
    );
};
