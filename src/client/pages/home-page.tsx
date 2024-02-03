import { readServerFile } from "@/client/api";
import { Box, Button, Chip, Divider, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import { useNotify } from "../utils/use-notify/notify-provider.component";
import { MDEditor } from "../components/util/elements/md-editor/md-editor.component";
import { Edit } from "@mui/icons-material";
import { Message } from "../components/util/common/message.components";
import { RouteMap } from "../routes";

export interface TodoItem {
    text?: string;
    done?: boolean;
    children?: TodoItem[];
}

// TODO: Move to env file
const ToDoFilePath = "/TODO.md";

export const HomePage: FunctionComponent = () => {
    const { notify } = useNotify();
    const ViewToDoFileUrl = RouteMap.browse.getPath(...ToDoFilePath.split("/"));

    const { data: todoFileData, status: todoFileLoadStatus } = useQuery({
        queryKey: ["TODO.md"],
        queryFn: async () => {
            const data = await readServerFile(ToDoFilePath);

            return data.file;
        },
    });

    return (
        <Box>
            <Button
                sx={{ my: 1 }}
                size="small"
                variant="outlined"
                color="primary"
                href={ViewToDoFileUrl}
                target="_blank"
            >
                <Edit fontSize="small" /> Edit Todos
            </Button>

            <Divider sx={{ my: 4 }} />

            {todoFileData && <MDEditor preview value={todoFileData} />}
            {todoFileLoadStatus !== "success" && (
                <Message
                    sx={{
                        bgcolor: "grey.100",
                        borderRadius: 2,
                    }}
                >
                    Error loading&nbsp;
                    <Chip
                        clickable
                        onClick={() => {
                            window.open(ViewToDoFileUrl, "_blank");
                        }}
                        size="small"
                        label={ToDoFilePath}
                    />
                </Message>
            )}
        </Box>
    );
};
