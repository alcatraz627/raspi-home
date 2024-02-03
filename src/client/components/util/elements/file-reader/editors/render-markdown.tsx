import { MDEditor } from "../../md-editor.component";
import { EditFileRenderProps } from "../utils/utils";

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
