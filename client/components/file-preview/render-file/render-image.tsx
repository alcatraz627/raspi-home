import { Box } from "@mui/material";
import { RenderFileProps } from "../file-preview";

export const RenderImage = ({ fileUrl }: RenderFileProps) => {
    return (
        <Box>
            <img src={fileUrl} width="100%" />
        </Box>
    );
};