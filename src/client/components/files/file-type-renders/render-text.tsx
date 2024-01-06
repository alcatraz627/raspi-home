import { readServerFile, updateServerFile } from "@/client/api";
import { useServerData } from "@/client/utils/use-server-data/use-server-data";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import debounce from "lodash/debounce";
import { useState, useEffect, KeyboardEventHandler, useCallback } from "react";
import { RenderFileProps } from "../file-preview";
import { Clear, Save } from "@mui/icons-material";
import { MDEditor } from "./md-editor/md-editor.component";
import { Loader } from "../../util/elements/loader.components";

export const RenderText = ({ fileUrl }: RenderFileProps) => {
    const [fileData, fileActions, fileStatus] = useServerData(readServerFile);
    const [content, setContent] = useState<string | null>(null);
    const [contentState, setContentState] = useState<string | null>(null);

    const loadFileContent = async (fileUrlProp: string) => {
        const data = await fileActions.query(fileUrlProp);
        setContent(data.file);
        setContentState(data.file);
    };
    const handleUpdateFile = async (contentsToUpdate: string | null) => {
        if (typeof contentsToUpdate !== "string") return;

        await updateServerFile(fileUrl, contentsToUpdate);
        setContent(contentsToUpdate);
        setContentState(contentsToUpdate);
    };

    const debouncedUpdateFile = useCallback(
        debounce((contentStateProp: typeof contentState) => {
            console.log("changed 2", contentStateProp);
            if (typeof contentStateProp !== "string") return;
            return handleUpdateFile(contentStateProp);
        }, 250),
        []
    );

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
        // Intercept save action by user
        if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleUpdateFile(contentState);
            return;
        }
    };

    const handleChange = (val: string) => {
        setContentState(val);
        debouncedUpdateFile(val);
    };

    const isMarkdown = fileUrl.endsWith(".md") || fileUrl.endsWith(".mdx");

    useEffect(() => {
        if (fileUrl) {
            loadFileContent(fileUrl);
        }
    }, [fileUrl]);

    const isEdited = content !== contentState;

    if (fileStatus.isLoading || fileStatus.isInitial)
        return (
            <Loader
                rootProps={{ display: "flex", py: 20, px: 0, width: "100%" }}
            />
        );

    if (fileStatus.isError) return <>Error Loading file {fileUrl}</>;

    return (
        <Box key={fileUrl}>
            {isMarkdown ? (
                <MDEditor
                    value={contentState || ""}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                />
            ) : (
                <TextField
                    fullWidth
                    multiline
                    rows={12}
                    value={contentState}
                    onChange={(e) => {
                        handleChange(e.target.value);
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
        </Box>
    );
};
