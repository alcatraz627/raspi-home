import { Box, Checkbox, Container, Typography } from "@mui/material";
import React, { FunctionComponent } from "react";

export interface TodoItem {
    text?: string;
    done?: boolean;
}

export const HomePage: FunctionComponent = () => {
    const todoItems: (TodoItem & { children?: TodoItem[] })[] = [
        {
            text: "csv reader/writer",
            children: [
                { text: "drag and drop file upload" },
                { text: "create / delete folders" },
                { text: "text editor" },
            ],
        },
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
                <>
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
                    {t.children &&
                        t.children.map((c) => (
                            <Box
                                key={t.text}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    pl: 4,
                                }}
                            >
                                <Checkbox checked={t.done} />
                                <Typography variant="body1">
                                    {t.text}
                                </Typography>
                            </Box>
                        ))}
                </>
            ))}
        </Box>
    );
};
