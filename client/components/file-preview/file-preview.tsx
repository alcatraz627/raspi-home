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
import { AddCircleOutline, Close, Save } from "@mui/icons-material";

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
    rootStyle?: SxProps<Theme>;
}

export interface RenderFileProps {
    fileUrl: string;
}

export const FilePreview = ({ fileUrl, rootStyle }: FilePreviewProps) => {
    const fileType = guessFileType(fileUrl);
    const [fileNameState, setFileName] = useState<string>();

    const parsedFileName = (fileUrl && fileUrl.split("/").pop()) || null;
    const isFileNameChanged = fileUrl && parsedFileName !== fileNameState;

    const handleSaveFileName = () => {
        const isNewNameValid = !!fileNameState;
    };

    useEffect(() => {
        if (fileUrl) {
            const newParsedFileName = fileUrl.split("/").pop() || "";
            setFileName(newParsedFileName);
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
                                    setFileName(e.target.value);
                                }}
                                error={!fileNameState}
                                InputProps={{
                                    endAdornment:
                                        fileNameState && isFileNameChanged ? (
                                            <InputAdornment position="end">
                                                <Save
                                                    onClick={handleSaveFileName}
                                                    fontSize="small"
                                                    color="primary"
                                                    sx={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </InputAdornment>
                                        ) : null,
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
