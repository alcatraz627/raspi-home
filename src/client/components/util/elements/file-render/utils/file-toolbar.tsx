import { ArrowCircleDown, Close, RestartAlt, Save } from "@mui/icons-material";
import {
    TextField,
    InputAdornment,
    Box,
    Button,
    ButtonGroup,
    ToggleButton,
    ToggleButtonGroup,
    Toolbar,
    Typography,
} from "@mui/material";
import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from "react";
import { FileName } from "./file-name";
import { NavigatePath } from "@/client/pages/directory-page";
import { FileType } from "./utils";

export interface FileToolbarProps {
    fileType: FileType;
    selectedRenderer: FileType; // TODO -> Enum
    setSelectedRenderer: (value: SetStateAction<FileType>) => void;

    updateSelectedFileCache: (newPath: NavigatePath) => void;
    fileUrl: string | null;

    handleSaveFileName: (newFileUrl: string) => Promise<void>;
}

export const FileToolbar: FunctionComponent<FileToolbarProps> = ({
    fileType,
    selectedRenderer: fileRenderer,
    setSelectedRenderer: setFileRenderer,
    updateSelectedFileCache,
    fileUrl,
    handleSaveFileName,
}) => {
    const [fileNameState, setFileNameState] = useState<string>("");

    const parsedFileName = useMemo(() => {
        if (fileUrl) {
            return fileUrl.split("/").pop() ?? null;
        }

        return null;
    }, [fileUrl]);

    const isNewNameValid = !!(fileNameState && fileNameState.trim().length > 0);

    const isFileNameChanged = !!(
        fileUrl && parsedFileName !== fileNameState?.trim()
    );

    const handleResetFileName = () => {
        if (parsedFileName) {
            setFileNameState(parsedFileName);
        }
    };

    const callSaveFileName = async () => {
        if (!isNewNameValid || !fileUrl) return;

        const newFileUrl =
            fileUrl?.split("/").slice(0, -1).concat(fileNameState).join("/") ||
            "";

        handleSaveFileName(newFileUrl);
    };

    // Update the file name textbox and the renderer being used
    useEffect(() => {
        if (fileUrl) {
            const newParsedFileName = fileUrl.split("/").pop() || "";
            setFileNameState(newParsedFileName);

            setFileRenderer(fileType);
        }
    }, [fileUrl]);

    // Todo: Save on ctrl + s

    return (
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
                handleSaveFileName={callSaveFileName}
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
                <Button variant="outlined" href={"/api/browse/" + fileUrl}>
                    <ArrowCircleDown fontSize="small" />
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        updateSelectedFileCache(null);
                    }}
                >
                    <Close fontSize="small" />
                </Button>
            </ButtonGroup>
        </Toolbar>
    );
};
