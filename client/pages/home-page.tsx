import { Box, Button, Checkbox, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { useNotify } from "../utils/use-notify/notify-provider.component";

export interface TodoItem {
    text?: string;
    done?: boolean;
    children?: TodoItem[];
}

export const HomePage: FunctionComponent = () => {
    const { notify } = useNotify();
    const todoItems: TodoItem[] = [
        {
            text: "utils",
            children: [
                { text: "toast provider notif" },
                { text: "error handling" },
                { text: "modal as promise" },
            ],
        },
        {
            text: "file explorer",
            children: [
                { text: "drag and drop file upload" },
                { text: "soft delete" },
                { text: "mobile compatible" },
                { text: "modal as promise" },
            ],
        },
        {
            text: "markdown editor",
            children: [
                { text: "view / edit mode" },
                { text: "live edit" },
                { text: "tags" },
                { text: "searching" },
            ],
        },
        {
            text: "csv reader/writer",
            children: [{ text: "spreadsheet ui" }],
        },
        {
            text: "deployment",
        },
    ];

    return (
        <Box>
            <Typography variant="h4">To Do</Typography>

            <Button
                onClick={() => {
                    notify({
                        title: "hello",
                        message: Date.now().toString(),
                    });
                }}
            >
                Show notif
            </Button>

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
                                key={c.text}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    pl: 4,
                                }}
                            >
                                <Checkbox checked={t.done} />
                                <Typography variant="body1">
                                    {c.text}
                                </Typography>
                            </Box>
                        ))}
                </>
            ))}
        </Box>
    );
};
