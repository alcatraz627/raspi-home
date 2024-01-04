import { useIsMobile } from "@/client/utils/hooks";
import {
    ArrowUpward,
    Cached,
    CreateNewFolder,
    Edit,
} from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { truncate } from "../util/utils";

export interface DirectoryTitleProps {
    currentFolderName: string;
    pathString: string;
    handleCreateFolder: () => void;
    handleGoToParentFolder: () => void;
    handleRefreshFolderContents: () => void;
    handleRenameFolder: () => void;
    drawer?: boolean;
}

export const DirectoryTitle: FunctionComponent<DirectoryTitleProps> = ({
    currentFolderName,
    pathString,
    handleCreateFolder,
    handleGoToParentFolder,
    handleRefreshFolderContents,
    handleRenameFolder,
}) => {
    const isMobile = useIsMobile();
    return (
        <>
            <Typography variant="h4" sx={{ pl: 3 }}>
                {truncate(currentFolderName, isMobile ? 16 : 30)}
            </Typography>
            <Box sx={{ pl: 3 }}>
                <Tooltip title="Edit Dir Name">
                    <IconButton
                        onClick={handleRenameFolder}
                        size="small"
                        disabled={!pathString}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Create new folder">
                    <IconButton onClick={handleCreateFolder} size="small">
                        <CreateNewFolder fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Go to parent folder">
                    <IconButton
                        onClick={handleGoToParentFolder}
                        size="small"
                        disabled={!pathString}
                    >
                        <ArrowUpward fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Refresh folder contents">
                    <IconButton
                        onClick={handleRefreshFolderContents}
                        size="small"
                    >
                        <Cached fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </>
    );
};
