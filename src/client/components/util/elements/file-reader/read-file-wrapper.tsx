import { renameServerFile } from "@/client/api";
import { NavigatePath } from "@/client/pages/directory-page";
import {
    AppBar,
    Box,
    Divider,
    MenuItem,
    Select,
    SxProps,
    Theme,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { UploadFileProps } from "../upload-file";
import { EditFileWrapper } from "./edit-file-wrapper";
import { FileName } from "./utils/file-name";
import { FileToolbar } from "./utils/file-toolbar";
import { NoFileSelected } from "./utils/no-file-selected";
import {
    FileType,
    FileTypeList,
    getDefaultRenderer,
    guessFileType,
} from "./utils/utils";

export interface ReadFileWrapperProps {
    pathList: string[];
    fileUrl: string | null;
    refreshFolderContents: () => void;
    rootStyle?: SxProps<Theme>;
    updateSelectedFileCache: (newPath: NavigatePath) => void;
    createNewFile: () => Promise<void>;
    uploadFile: UploadFileProps["uploadFile"];
    initialFileReader?: FileType;
}

export const ReadFileWrapper = ({
    fileUrl,
    refreshFolderContents,
    updateSelectedFileCache,
    createNewFile,
    uploadFile,
    rootStyle,
    initialFileReader = "text",
}: ReadFileWrapperProps) => {
    const fileType = guessFileType(fileUrl);

    const [fileNameState, setFileNameState] = useState<string>("");
    const [selectedRenderer, setSelectedRenderer] =
        useState<FileType>(initialFileReader);

    const parsedFileName = useMemo(() => {
        if (fileUrl) {
            return fileUrl.split("/").pop() ?? null;
        }

        return null;
    }, [fileUrl]);

    const isFileNameChanged = !!(
        fileUrl && parsedFileName !== fileNameState?.trim()
    );

    const handleResetFileName = () => {
        if (parsedFileName) {
            setFileNameState(parsedFileName);
        }
    };

    const callSaveFileName = async () => {
        if (!fileUrl) return;

        const newFileUrl =
            fileUrl?.split("/").slice(0, -1).concat(fileNameState).join("/") ||
            "";

        if (!newFileUrl) return;

        try {
            await renameServerFile(fileUrl, newFileUrl);

            refreshFolderContents();
            updateSelectedFileCache(newFileUrl);
        } catch (error) {
            console.log(error);
        }
    };

    // Update the file name textbox and the renderer being used
    useEffect(() => {
        if (fileUrl) {
            const newParsedFileName = fileUrl.split("/").pop() || "";
            setFileNameState(newParsedFileName);
        }
    }, [fileUrl]);

    useEffect(() => {
        if (fileUrl) {
            setSelectedRenderer(fileType);
        }
    }, [fileUrl]);

    const [RenderFile, isEditable] = getDefaultRenderer(
        selectedRenderer || fileType
    );

    const SelectFileRenderer = () => (
        <Select
            value={selectedRenderer}
            size="small"
            sx={{
                bgcolor: "white",
            }}
            margin="none"
            onChange={(e) => {
                setSelectedRenderer(e.target.value as FileType);
            }}
        >
            {FileTypeList.map((fileTypeVal) => (
                <MenuItem value={fileTypeVal}>
                    <Typography variant="button">{fileTypeVal}</Typography>
                </MenuItem>
            ))}
        </Select>
    );

    const FileNameRenderer = () => (
        <FileName
            fileNameState={fileNameState}
            setFileNameState={setFileNameState}
            isFileNameChanged={isFileNameChanged}
            handleResetFileName={handleResetFileName}
            handleSaveFileName={callSaveFileName}
        />
    );

    if (!fileUrl) {
        return (
            <NoFileSelected
                createNewFile={createNewFile}
                uploadFile={uploadFile}
            />
        );
    }

    return (
        <Box sx={{ pt: 1, ...rootStyle }}>
            <AppBar variant="outlined" position="relative" color="default">
                <FileToolbar
                    fileType={fileType}
                    fileUrl={fileUrl}
                    clearFileSelectionInCache={() =>
                        updateSelectedFileCache(null)
                    }
                    SelectFileRenderer={SelectFileRenderer}
                    FileNameRenderer={FileNameRenderer}
                />
            </AppBar>
            <Divider />
            <Box width="100%">
                {isEditable ? (
                    <EditFileWrapper
                        fileUrl={fileUrl}
                        RenderFile={RenderFile}
                    />
                ) : (
                    <RenderFile fileUrl={fileUrl} />
                )}
            </Box>
        </Box>
    );
};
