import { renameServerFile } from "@/client/api";
import { NavigatePath } from "@/client/pages/directory-page";
import { AppBar, Box, Divider, SxProps, Theme } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { UploadFileProps } from "./upload-file";
import { FileToolbar } from "./utils/file-toolbar";
import { NoFileSelected } from "./utils/no-file-selected";
import { guessFileType, FileType, getDefaultRenderer } from "./utils/utils";

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
    FileReader?: FunctionComponent<FileReaderProps>;
}

export const FileReaderWrapper = ({
    fileUrl,
    refreshFolderContents,
    updateSelectedFileCache,
    createNewFile,
    uploadFile,
    rootStyle,
    FileReader,
}: FileReaderWrapperProps) => {
    const fileType = guessFileType(fileUrl);

    const [selectedRenderer, setSelectedRenderer] = useState<FileType>("text");

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

    const RenderFile =
        FileReader ?? getDefaultRenderer(selectedRenderer || fileType);

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
                    selectedRenderer={selectedRenderer}
                    setSelectedRenderer={setSelectedRenderer}
                    updateSelectedFileCache={updateSelectedFileCache}
                    handleSaveFileName={handleSaveFileName}
                />
            </AppBar>
            <Divider />
            <Box width="100%">
                <RenderFile fileUrl={fileUrl} key={selectedRenderer} />
            </Box>
        </Box>
    );
};
