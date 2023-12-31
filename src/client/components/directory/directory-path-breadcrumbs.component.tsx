import { NavigatePath } from "@/client/pages/directory-page";
import { Box, Input, Button } from "@mui/material";
import { FunctionComponent } from "react";
import { ServerBreadcrumbs } from "../util/server-breadcrumbs/server-breadcrumbs.component";
import { useIsMobile } from "@/client/utils/hooks";

export interface DirectoryPathBreadcrumbsProps {
    parsedPath: string[];
    handleSelectFolder: (newPath: NavigatePath) => void;
}

export const DirectoryPathBreadcrumbs: FunctionComponent<
    DirectoryPathBreadcrumbsProps
> = ({ parsedPath, handleSelectFolder }) => {
    const isMobile = useIsMobile();

    return (
        <Box
            sx={{
                px: 3,
                ...(isMobile && {
                    width: "clamp(100px, 70vw, 300px)",
                }),
            }}
        >
            <ServerBreadcrumbs
                parsedPath={parsedPath}
                selectFolder={handleSelectFolder}
            />
        </Box>
    );
};
