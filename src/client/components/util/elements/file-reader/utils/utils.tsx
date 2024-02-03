import { FunctionComponent } from "react";
import { RenderImage } from "../readers/render-image";
import { RenderMarkdown } from "../editors/render-markdown";
import { RenderPdf } from "../readers/render-pdf";
import { RenderText } from "../editors/render-text";
import { RenderVideo } from "../readers/render-video";
import { KeyboardEventHandler } from "react";

export type FileType =
    | "image"
    | "csv"
    | "markdown"
    | "text"
    | "pdf"
    | "video"
    | "html"; // TODO

export const FileTypeList: FileType[] = [
    "image",
    "csv",
    "markdown",
    "text",
    "pdf",
    "video",
    "html",
];

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
export const getDefaultRenderer = (
    fileTypeProp: FileType
):
    | [render: FunctionComponent<EditFileRenderProps>, editable: true]
    | [render: FunctionComponent<FileReaderProps>, editable: false] => {
    switch (fileTypeProp) {
        case "markdown":
            return [RenderMarkdown, true];
        case "image":
            return [RenderImage, false];
        case "pdf":
            return [RenderPdf, false];
        case "video":
            return [RenderVideo, false];
        case "csv":
        // TODO
        case "html":
        // TODO
        case "text":
        default:
            return [RenderText, true];
    }
};

export interface EditFileRenderProps {
    contentState: string | null;
    handleKeyDown: KeyboardEventHandler<HTMLDivElement>;
    handleChange: (val: string) => void;
    height: string;
}

export interface FileReaderProps {
    height: string;
    fileUrl: string;
}
