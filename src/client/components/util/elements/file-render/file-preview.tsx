import { renameServerFile } from "@/client/api";
import { NavigatePath } from "@/client/pages/directory-page";
import {
    AddCircleOutline,
    ArrowCircleDown,
    Close,
    RestartAlt,
    Save,
} from "@mui/icons-material";
import {
    AppBar,
    Box,
    Button,
    ButtonGroup,
    Divider,
    InputAdornment,
    SxProps,
    TextField,
    Theme,
    ToggleButton,
    ToggleButtonGroup,
    Toolbar,
    Typography,
} from "@mui/material";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { RenderText, RenderTextProps } from "./file-type-renders/render-text";
import { RenderImage } from "./file-type-renders/render-image";
import { TFile, UploadFile, UploadFileProps } from "./upload-file";
import { RenderPdf } from "./file-type-renders/render-pdf";
import { RenderVideo } from "./file-type-renders/render-video";
import { FileName } from "./file-name";

export type FileType = "image" | "csv" | "markdown" | "text" | "pdf" | "video";

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

const guessFileType = (fileName: string | null): FileType => {
    if (!fileName) return "text";
    const fileExt = fileName.split(".").pop();

    if (!fileExt) return "text";

    return FileExtMap?.[fileExt] || "text";
};

export interface FilePreviewProps {
    pathList: string[];
    fileUrl: string | null;
    refreshFolderContents: () => void;
    rootStyle?: SxProps<Theme>;
    updateSelectedFile: (newPath: NavigatePath) => void;
    createNewFile: () => void;
    uploadFile: UploadFileProps["uploadFile"];
}

export interface RenderFileProps {
    fileUrl: string;
}

export const FilePreview = ({
    fileUrl,
    refreshFolderContents,
    updateSelectedFile,
    createNewFile,
    uploadFile,
    rootStyle,
}: FilePreviewProps) => {
    const fileType = guessFileType(fileUrl);

    const [fileRenderer, setFileRenderer] = useState<"text" | "default">(
        "default"
    );

    const [fileNameState, setFileNameState] = useState<string>("");

    const parsedFileName = useMemo(() => {
        if (fileUrl) {
            return fileUrl.split("/").pop() ?? null;
        }

        return null;
    }, [fileUrl]);

    const isFileNameChanged = !!(
        fileUrl && parsedFileName !== fileNameState?.trim()
    );

    const isNewNameValid = !!(fileNameState && fileNameState.trim().length > 0);

    const handleResetFileName = () => {
        if (parsedFileName) {
            setFileNameState(parsedFileName);
        }
    };

    const handleSaveFileName = async () => {
        if (!isNewNameValid || !fileUrl) return;

        const newFileUrl =
            fileUrl?.split("/").slice(0, -1).concat(fileNameState).join("/") ||
            "";

        try {
            await renameServerFile(fileUrl, newFileUrl);

            refreshFolderContents();
            updateSelectedFile(newFileUrl);
        } catch (error) {
            console.log(error);
        }
    };

    // Update the file name textbox and the renderer being used
    useEffect(() => {
        if (fileUrl) {
            const newParsedFileName = fileUrl.split("/").pop() || "";
            setFileNameState(newParsedFileName);

            setFileRenderer("default");
        }
    }, [fileUrl]);

    // TODO: Move wrapper to another component
    // The file renderer to use, based on file name extension
    const RenderFile = useMemo(() => {
        if (fileRenderer === "text") return RenderText;

        switch (fileType) {
            case "image":
                return RenderImage;
            case "markdown":
                return (props: Omit<RenderTextProps, "editorType">) => (
                    <RenderText editorType="markdown" {...props} />
                );
            case "csv":
            // TODO
            case "pdf":
                return RenderPdf;

            case "video":
                return RenderVideo;
            case "text":
            default:
                return RenderText;
        }
    }, [fileUrl, fileRenderer]);

    if (!fileUrl) {
        return (
            <Box sx={{ pt: 1, ...rootStyle }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="body1" color="gray">
                        No file selected
                        <br />
                        <Button
                            sx={{ mt: 1 }}
                            variant="outlined"
                            onClick={createNewFile}
                        >
                            <AddCircleOutline />
                            &nbsp; Create a file
                        </Button>
                    </Typography>
                </Box>
                <Divider
                    sx={{
                        my: 2,
                        mx: "auto",
                        width: "50%",
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    <UploadFile uploadFile={uploadFile} />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ pt: 1, ...rootStyle }}>
            <AppBar variant="outlined" position="relative" color="default">
                {/* TODO: Move the toolbar to another component */}
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gridGap: "12px",
                    }}
                >
                    <Typography variant="subtitle2" color="gray">
                        {fileType}
                    </Typography>

                    <FileName
                        fileNameState={fileNameState}
                        setFileNameState={setFileNameState}
                        isNewNameValid={isNewNameValid}
                        isFileNameChanged={isFileNameChanged}
                        handleResetFileName={handleResetFileName}
                        handleSaveFileName={handleSaveFileName}
                    />

                    <Box flexGrow={1} />
                    {(["csv", "markdown"] as FileType[]).includes(fileType) && (
                        <ToggleButtonGroup
                            exclusive
                            color="primary"
                            value={fileRenderer}
                            size="small"
                            onChange={(e, v) => {
                                if (v === null) return;
                                setFileRenderer(v as typeof fileRenderer);
                            }}
                        >
                            <ToggleButton value="default" size="small">
                                {fileType}
                            </ToggleButton>
                            <ToggleButton value="text" size="small">
                                text
                            </ToggleButton>
                        </ToggleButtonGroup>
                    )}

                    <ButtonGroup>
                        <Button
                            variant="outlined"
                            href={"/api/browse/" + fileUrl}
                        >
                            <ArrowCircleDown fontSize="small" />
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                updateSelectedFile(null);
                            }}
                        >
                            <Close fontSize="small" />
                        </Button>
                    </ButtonGroup>
                </Toolbar>
            </AppBar>
            <Divider />
            <Box width="100%">
                <RenderFile fileUrl={fileUrl} key={fileRenderer} />
            </Box>
        </Box>
    );
};
