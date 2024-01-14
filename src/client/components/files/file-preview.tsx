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
import { useEffect, useMemo, useState } from "react";
import {
    RenderEditor,
    RenderEditorProps,
} from "./file-type-renders/render-editor";
import { RenderImage } from "./file-type-renders/render-image";

export type FileType = "image" | "csv" | "markdown" | "text" | "pdf" | "video";

export const FileExtMap: Record<string, FileType> = {
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",

    pdf: "pdf",

    mp4: "video",
    flv: "video",
    mov: "video",
    aac: "video",

    csv: "csv",

    md: "markdown",

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
}

export interface RenderFileProps {
    fileUrl: string;
}

export const FilePreview = ({
    fileUrl,
    refreshFolderContents,
    updateSelectedFile,
    createNewFile,
    rootStyle,
}: FilePreviewProps) => {
    const fileType = guessFileType(fileUrl);

    const [fileRenderer, setFileRenderer] = useState<"text" | "default">(
        "default"
    );

    const [fileNameState, setFileNameState] = useState<string>();

    const parsedFileName = useMemo(() => {
        if (fileUrl) {
            return fileUrl.split("/").pop() ?? null;
        }

        return null;
    }, [fileUrl]);

    const isFileNameChanged =
        fileUrl && parsedFileName !== fileNameState?.trim();

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

    // The file renderer to use, based on file name extension
    const RenderFile = useMemo(() => {
        if (fileRenderer === "text") return RenderEditor;

        switch (fileType) {
            case "image":
                return RenderImage;
            case "markdown":
                return (props: Omit<RenderEditorProps, "editorType">) => (
                    <RenderEditor editorType="markdown" {...props} />
                );
            case "csv":
            // TODO
            case "pdf":
            // TODO
            case "video":
            // TODO
            case "text":
            default:
                return RenderEditor;
        }
    }, [fileUrl, fileRenderer]);

    return (
        <Box sx={{ pt: 1, ...rootStyle }}>
            {fileUrl ? (
                <>
                    <AppBar
                        variant="outlined"
                        position="relative"
                        color="default"
                    >
                        <Toolbar
                            sx={{
                                display: "flex",
                                // justifyContent: "space-between",
                                alignItems: "center",
                                gridGap: "12px",
                            }}
                        >
                            <Typography variant="subtitle2" color="gray">
                                {fileType}
                            </Typography>
                            <TextField
                                variant="standard"
                                value={fileNameState}
                                onChange={(e) => {
                                    setFileNameState(e.target.value);
                                }}
                                error={!isNewNameValid}
                                InputProps={{
                                    endAdornment: isFileNameChanged && (
                                        <InputAdornment position="end">
                                            <RestartAlt
                                                onClick={handleResetFileName}
                                                fontSize="small"
                                                color="primary"
                                                sx={{
                                                    cursor: "pointer",
                                                }}
                                            />
                                            {isNewNameValid && (
                                                <Save
                                                    onClick={handleSaveFileName}
                                                    fontSize="small"
                                                    color="primary"
                                                    sx={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            )}
                                        </InputAdornment>
                                    ),
                                    onBlur: () => {
                                        setFileNameState((v) => v?.trim());
                                    },
                                }}
                            />
                            <Box flexGrow={1} />
                            {(["csv", "markdown"] as FileType[]).includes(
                                fileType
                            ) && (
                                <ToggleButtonGroup
                                    exclusive
                                    color="primary"
                                    value={fileRenderer}
                                    size="small"
                                    onChange={(e, v) => {
                                        if (v === null) return;
                                        setFileRenderer(
                                            v as typeof fileRenderer
                                        );
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
                </>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
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
            )}
        </Box>
    );
};
