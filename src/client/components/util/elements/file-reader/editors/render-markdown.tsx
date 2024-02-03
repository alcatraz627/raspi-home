import { MDEditor } from "../../md-editor/md-editor.component";
import { EditFileRenderProps } from "../edit-file-wrapper";

export const RenderMarkdown = ({
    contentState,
    handleKeyDown,
    handleChange,
    height,
}: EditFileRenderProps) => {
    return (
        <MDEditor
            value={contentState || ""}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            height={height}
        />
    );
};
