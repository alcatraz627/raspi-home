import { readServerFile, updateServerFile } from "@/client/api";
import { useServerData } from "@/client/utils/use-server-data/use-server-data";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useState, useEffect, KeyboardEventHandler } from "react";
import { RenderFileProps } from "../file-preview";
import { Clear, Save } from "@mui/icons-material";
import { MDEditor } from "./md-editor/md-editor.component";

export const RenderText = ({ fileUrl }: RenderFileProps) => {
    const [fileData, fileActions, fileStatus] = useServerData(readServerFile);
    const [content, setContent] = useState<string | null>(null);
    const [contentState, setContentState] = useState<string | null>(null);

    const loadFileContent = async (fileUrlProp: string) => {
        const data = await fileActions.query(fileUrlProp);
        setContent(data.file);
    };
    const handleUpdateFile = async () => {
        if (typeof contentState !== "string") return;

        await updateServerFile(fileUrl, contentState);
        setContent(contentState);
    };

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
        // Intercept save action by user
        if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleUpdateFile();
        }
    };

    const isMarkdown = fileUrl.endsWith(".md") || fileUrl.endsWith(".mdx");

    useEffect(() => {
        setContentState(content);
    }, [content]);

    useEffect(() => {
        if (fileUrl) {
            loadFileContent(fileUrl);
        }
    }, [fileUrl]);

    const isEdited = content !== contentState;

    if (fileStatus.isLoading || fileStatus.isInitial)
        return <CircularProgress />;

    if (fileStatus.isError) return <>Error Loading file {fileUrl}</>;

    return (
        <>
            {isMarkdown ? (
                <MDEditor
                    value={contentState || ""}
                    onKeyDown={handleKeyDown}
                    onChange={(val) => setContentState(val)}
                />
            ) : (
                <TextField
                    fullWidth
                    multiline
                    rows={12}
                    value={contentState || ""}
                    onChange={(e) => {
                        setContentState(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        sx: {
                            fontFamily: "monospace!important",
                            fontSize: 16,
                            bgcolor: "#333",
                            color: "primary.contrastText",
                        },
                    }}
                />
            )}
            <Box display="flex" justifyContent="space-between" py={2} gap={2}>
                <Box flexGrow={1} />
                <Button
                    variant="outlined"
                    onClick={() => setContentState(content)}
                    disabled={!isEdited}
                >
                    <Clear fontSize="small" />
                    &nbsp; Reset
                </Button>
                <Button
                    variant="contained"
                    onClick={handleUpdateFile}
                    disabled={!isEdited}
                >
                    <Save fontSize="small" />
                    &nbsp; Save
                </Button>
            </Box>
        </>
    );
};
