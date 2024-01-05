import { Box, Chip } from "@mui/material";
import { Fragment, FunctionComponent } from "react";
import { NavigatePath } from "../../../pages/directory-page";
import { useIsMobile } from "../../../utils/hooks";

export interface ServerBreadcrumbsProps {
    parsedPath: string[];
    selectFolder: (newPath: NavigatePath) => void;
}

export const ServerBreadcrumbs: FunctionComponent<ServerBreadcrumbsProps> = ({
    parsedPath,
    selectFolder,
}) => {
    const isMobile = useIsMobile();

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
                ...(isMobile && {
                    flexWrap: "wrap",
                    mb: 2,
                }),
            }}
        >
            <Chip
                label="Server"
                variant="filled"
                sx={{ mx: 0.5, my: isMobile ? 0.5 : 1 }}
                size="small"
                onClick={() => selectFolder("")}
            />
            /
            {parsedPath.map((p, i) => (
                <Fragment key={i}>
                    <Chip
                        label={decodeURIComponent(p)}
                        variant="outlined"
                        sx={{ mx: 0.5, my: isMobile ? 0.5 : 1 }}
                        size="small"
                        onClick={() => handleSelectFolderAtIndex(i)}
                    />
                    /
                </Fragment>
            ))}
        </Box>
    );
};
