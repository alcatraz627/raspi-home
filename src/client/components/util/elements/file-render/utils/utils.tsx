import { RenderImage } from "../file-type-renders/render-image";
import { RenderPdf } from "../file-type-renders/render-pdf";
import { RenderTextProps, RenderText } from "../file-type-renders/render-text";
import { RenderVideo } from "../file-type-renders/render-video";

export type FileType =
    | "image"
    | "csv"
    | "markdown"
    | "text"
    | "pdf"
    | "video"
    | "html"; // TODO

// Get file type from file extension
export const FileExtMap: Record<string, FileType> = {
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",
    webp: "image",

    pdf: "pdf",

    mp4: "video",
    flv: "video",
    mov: "video",
    aac: "video",

    csv: "csv",

    md: "markdown",
    mdx: "markdown",

    log: "text",
    env: "text",

    txt: "text",
};

export const guessFileType = (fileName: string | null): FileType => {
    if (!fileName) return "text";
    const fileExt = fileName.split(".").pop();

    if (!fileExt) return "text";

    return FileExtMap?.[fileExt] || "text";
};

// The file renderer to use, based on file name extension
export const getDefaultRenderer = (fileTypeProp: FileType) => {
    switch (fileTypeProp) {
        case "markdown":
            return (props: Omit<RenderTextProps, "editorType">) => (
                <RenderText editorType="markdown" {...props} />
            );
        case "image":
            return RenderImage;
        case "pdf":
            return RenderPdf;
        case "video":
            return RenderVideo;
        case "csv":
        // TODO
        case "html":
        // TODO
        case "text":
        default:
            return RenderText;
    }
};
