import { TextField } from "@mui/material";
import { EditFileRenderProps } from "../edit-file-wrapper";

// TODO: Allow passing custom renderer
export const RenderText = ({
    contentState,
    handleKeyDown,
    handleChange,
}: EditFileRenderProps) => {
    return (
        <TextField
            fullWidth
            multiline
            // rows={12}
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
                    fontFamily: "monospace!important",
                    fontSize: 16,
                    bgcolor: "#333",
                    color: "primary.contrastText",
                },
            }}
        />
    );
};
