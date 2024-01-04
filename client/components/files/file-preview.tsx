import {
    AppBar,
    Box,
    Button,
    ButtonGroup,
    Chip,
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
import { RenderImage } from "./file-type-renders/render-image";
import { RenderText } from "./file-type-renders/render-text";
import {
    AddCircleOutline,
    ArrowCircleDown,
    Close,
    RestartAlt,
    Save,
} from "@mui/icons-material";
import { renameServerFile } from "@/client/api";
import { NavigatePath } from "@/client/pages/directory-page";

export type FileType = "image" | "csv" | "markdown" | "text";

export const FileExtMap: Record<string, FileType> = {
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",

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

    useEffect(() => {
        if (fileUrl) {
            const newParsedFileName = fileUrl.split("/").pop() || "";
            setFileNameState(newParsedFileName);

            setFileRenderer("default");
        }
    }, [fileUrl]);

    const RenderFile = useMemo(() => {
        if (fileRenderer === "text") return RenderText;

        switch (fileType) {
            case "image":
                return RenderImage;
            case "markdown":
            // return RenderText;
            case "csv":
            // return RenderText;
            case "text":
            default:
                return RenderText;
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
                        <RenderFile fileUrl={fileUrl} />
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
