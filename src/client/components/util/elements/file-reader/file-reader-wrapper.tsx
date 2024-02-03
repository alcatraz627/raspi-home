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
import { useEffect, useState } from "react";
import { UploadFileProps } from "./upload-file";
import { FileToolbar } from "./utils/file-toolbar";
import { NoFileSelected } from "./utils/no-file-selected";
import {
    guessFileType,
    FileType,
    getDefaultRenderer,
    FileTypeList,
} from "./utils/utils";
import { EditFileWrapper } from "./edit-file-wrapper";

export interface FileReaderProps {
    fileUrl: string;
}

export interface FileReaderWrapperProps {
    pathList: string[];
    fileUrl: string | null;
    refreshFolderContents: () => void;
    rootStyle?: SxProps<Theme>;
    updateSelectedFileCache: (newPath: NavigatePath) => void;
    createNewFile: () => Promise<void>;
    uploadFile: UploadFileProps["uploadFile"];
    initialFileReader?: FileType;
}

export const FileReaderWrapper = ({
    fileUrl,
    refreshFolderContents,
    updateSelectedFileCache,
    createNewFile,
    uploadFile,
    rootStyle,
    initialFileReader = "text",
}: FileReaderWrapperProps) => {
    const fileType = guessFileType(fileUrl);

    const [selectedRenderer, setSelectedRenderer] =
        useState<FileType>(initialFileReader);

    const handleSaveFileName = async (newFileUrl: string) => {
        if (!fileUrl) return;

        try {
            await renameServerFile(fileUrl, newFileUrl);

            refreshFolderContents();
            updateSelectedFileCache(newFileUrl);
        } catch (error) {
            console.log(error);
        }
    };

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
                    handleSaveFileName={handleSaveFileName}
                    SelectFileRenderer={SelectFileRenderer}
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
