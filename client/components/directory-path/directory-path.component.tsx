import { NavigatePath } from "@/client/pages/directory-page";
import { Box, Input, Button } from "@mui/material";
import { FunctionComponent } from "react";
import { ServerBreadcrumbs } from "../server-breadcrumbs/server-breadcrumbs.component";

export interface DirectoryPathProps {
    parsedPath: string[];
    handleSelectFolder: (newPath: NavigatePath) => void;
}

export const DirectoryPath: FunctionComponent<DirectoryPathProps> = ({
    parsedPath,
    handleSelectFolder,
}) => {
    return (
        <Box
            sx={{
                px: 3,
            }}
        >
            <ServerBreadcrumbs
                parsedPath={parsedPath}
                selectFolder={handleSelectFolder}
            />
        </Box>
    );
};
