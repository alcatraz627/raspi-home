import { NavigatePath } from "@/client/pages/directory-page";
import { Box, Chip } from "@mui/material";
import { FunctionComponent } from "react";

export interface ServerBreadcrumbsProps {
    parsedPath: string[];
    selectFolder: (newPath: NavigatePath) => void;
}

export const ServerBreadcrumbs: FunctionComponent<ServerBreadcrumbsProps> = ({
    parsedPath,
    selectFolder,
}) => {
    const handleSelectFolderAtIndex = (idx: number) => {
        const newPath = "/" + parsedPath.slice(0, idx + 1).join("/");
        selectFolder(newPath);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <Chip
                label="Server"
                variant="filled"
                sx={{ mx: 0.5, my: 1 }}
                size="small"
                onClick={() => selectFolder("")}
            />
            /
            {parsedPath.map((p, i) => (
                <>
                    <Chip
                        label={p}
                        variant="outlined"
                        sx={{ mx: 0.5, my: 1 }}
                        size="small"
                        onClick={() => handleSelectFolderAtIndex(i)}
                    />
                    /
                </>
            ))}
        </Box>
    );
};
