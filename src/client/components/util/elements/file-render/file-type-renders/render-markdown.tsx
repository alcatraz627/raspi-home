import { RenderText, RenderTextProps } from "./render-text";

export type RenderMarkdownProps = Omit<RenderTextProps, "editorType">;

export const RenderMarkdown = (props: RenderMarkdownProps) => {
    return <RenderText {...props} editorType="markdown" />;
};
