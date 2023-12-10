import {
    AppBar,
    Box,
    Button,
    Chip,
    Divider,
    InputAdornment,
    SxProps,
    TextField,
    Theme,
    Toolbar,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { RenderImage } from "./render-file/render-image";
import { RenderText } from "./render-file/render-text";
import { AddCircleOutline, Close, RestartAlt, Save } from "@mui/icons-material";
import { moveServerFile } from "@/client/api";
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
}

export interface RenderFileProps {
    fileUrl: string;
}

export const FilePreview = ({
    fileUrl,
    refreshFolderContents,
    updateSelectedFile,
    rootStyle,
}: FilePreviewProps) => {
    const fileType = guessFileType(fileUrl);
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
            await moveServerFile(fileUrl, newFileUrl);

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
        }
    }, [fileUrl]);

    const RenderFile = useMemo(() => {
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
    }, [fileUrl]);

    return (
        <Box sx={{ ...rootStyle }}>
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
                            <Button size="small" variant="outlined">
                                <Close fontSize="small" />
                                Close
                            </Button>
                            <Button size="small" variant="contained">
                                <Save fontSize="small" />
                                &nbsp; Save
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Divider />
                    <RenderFile fileUrl={fileUrl} />
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
                        <Button sx={{ mt: 1 }} variant="outlined">
                            <AddCircleOutline />
                            &nbsp; Create a file
                        </Button>
                    </Typography>
                </Box>
            )}
        </Box>
    );
};
