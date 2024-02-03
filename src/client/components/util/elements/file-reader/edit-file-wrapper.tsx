import { readServerFile, updateServerFile } from "@/client/api";
import { useServerData } from "@/client/utils/use-server-data/use-server-data";
import { Box, Button } from "@mui/material";
import debounce from "lodash/debounce";
import {
    useState,
    useEffect,
    KeyboardEventHandler,
    useCallback,
    FunctionComponent,
} from "react";
import { FileReaderProps } from "./file-reader-wrapper";
import { Clear, Save } from "@mui/icons-material";
import { Loader } from "../../common/loader.components";
import { FileType } from "./utils/utils";
import { useIsMobile } from "@/client/utils/hooks";

export interface EditFileRenderProps {
    contentState: string | null;
    handleKeyDown: KeyboardEventHandler<HTMLDivElement>;
    handleChange: (val: string) => void;
    height: string;
}

export interface EditFileWrapperProps extends FileReaderProps {
    RenderFile: FunctionComponent<EditFileRenderProps>;
}

// TODO: Allow passing custom renderer
export const EditFileWrapper = ({
    fileUrl,
    RenderFile,
}: EditFileWrapperProps) => {
    const isMobile = useIsMobile();
    const [fileData, fileActions, fileStatus] = useServerData(readServerFile);
    const [content, setContent] = useState<string | null>(null);
    const [contentState, setContentState] = useState<string | null>(null);
    useEffect(() => {
        if (fileUrl) {
            loadFileContent(fileUrl);
        }
    }, [fileUrl]);

    const loadFileContent = async (fileUrlProp: string) => {
        const data = await fileActions.query(fileUrlProp);
        setContent(data.file);
        setContentState(data.file);
    };
    const handleUpdateFile = async (contentsToUpdate: string | null) => {
        if (typeof contentsToUpdate !== "string") return;

        await updateServerFile(fileUrl, contentsToUpdate);
        setContent(contentsToUpdate);
        setContentState(contentsToUpdate);
    };

    const debouncedUpdateFile = useCallback(
        debounce((contentStateProp: typeof contentState) => {
            if (typeof contentStateProp !== "string") return;
            return handleUpdateFile(contentStateProp);
        }, 1000),
        []
    );

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
        // Intercept save action by user
        if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleUpdateFile(contentState);
            return;
        }
    };

    const handleChange = (val: string) => {
        setContentState(val);
        debouncedUpdateFile(val);
    };

    const isEdited = content !== contentState;

    if (fileStatus.isLoading || fileStatus.isInitial)
        return (
            <Loader
                rootProps={{ display: "flex", py: 20, px: 0, width: "100%" }}
            />
        );

    if (fileStatus.isError) return <>Error Loading file {fileUrl}</>;

    return (
        <Box key={fileUrl}>
            <RenderFile
                contentState={contentState}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                height={
                    isMobile ? "calc(100dvh - 264px)" : "calc(100dvh - 430px)"
                }
            />

            <Box display="flex" justifyContent="space-between" py={2} gap={2}>
                <Box flexGrow={1} />
                <Button
                    variant="outlined"
                    onClick={() => setContentState(content)}
                    disabled={!isEdited}
                >
                    <Clear fontSize="small" />
                    &nbsp; Reset
                </Button>
                <Button
                    variant="contained"
                    onClick={() => handleUpdateFile(contentState)}
                    disabled={!isEdited}
                >
                    <Save fontSize="small" />
                    &nbsp; Save
                </Button>
            </Box>
        </Box>
    );
};
