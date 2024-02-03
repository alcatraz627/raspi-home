import { TextField } from "@mui/material";
import { EditFileRenderProps } from "../utils/utils";

// TODO: Allow passing custom renderer
export const RenderText = ({
    contentState,
    handleKeyDown,
    handleChange,
    height,
}: EditFileRenderProps) => {
    return (
        <TextField
            fullWidth
            multiline
            // rows={20}
            value={contentState}
            sx={{
                height: "100%",
            }}
            onChange={(e) => {
                handleChange(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            InputProps={{
                sx: {
                    height: height,
                    fontFamily: "monospace!important",
                    fontSize: 16,
                    bgcolor: "#333",
                    color: "primary.contrastText",
                },
            }}
        />
    );
};
