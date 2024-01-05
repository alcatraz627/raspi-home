import { Box } from "@mui/material";
import React, { FunctionComponent, lazy } from "react";
import { IMarkdownEditor } from "@uiw/react-markdown-editor";

const MarkdownEditor = lazy(() => import("@uiw/react-markdown-editor"));

export interface MDEditorProps extends IMarkdownEditor {
    value: string;
    onChange?: (value: string) => void;
}

export const MDEditor: FunctionComponent<MDEditorProps> = ({
    value,
    onChange,
    ...editorProps
}) => {
    return (
        <Box data-color-mode="light">
            <Box component="div">
                <MarkdownEditor
                    value={value}
                    onChange={onChange}
                    height="50vh" // TODO: Proper height
                    {...editorProps}
                />
            </Box>
        </Box>
    );
};
