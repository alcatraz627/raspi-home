import { Box } from "@mui/material";
import React, { FunctionComponent, Suspense, lazy } from "react";
import { IMarkdownEditor } from "@uiw/react-markdown-editor";
import { Loader } from "@/client/components/util/elements/loader.components";

import MarkdownEditor from "@uiw/react-markdown-editor";
// const MarkdownEditor = lazy(() => import("@uiw/react-markdown-editor"));

export interface MDEditorProps extends IMarkdownEditor {
    value: string;
    onChange?: (value: string) => void;
    preview?: boolean;
}

const MdEditorShell: FunctionComponent<{ children: JSX.Element }> = ({
    children,
}) => (
    <Box data-color-mode="light">
        <Box component="div">
            <Suspense fallback={<Loader fullWidth />}>{children}</Suspense>
        </Box>
    </Box>
);

export const MDEditor: FunctionComponent<MDEditorProps> = ({
    value,
    onChange,
    preview,
    ...editorProps
}) => {
    // const MDComponent = preview ? MarkdownEditor.

    if (preview) {
        return (
            <MdEditorShell>
                <MarkdownEditor.Markdown
                    source={value}
                    height="50vh" // TODO: Proper height
                    {...editorProps}
                />
            </MdEditorShell>
        );
    }

    return (
        <MdEditorShell>
            <MarkdownEditor
                value={value}
                onChange={onChange}
                height="50vh" // TODO: Proper height
                {...editorProps}
            />
        </MdEditorShell>
    );
};
