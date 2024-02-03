import { RestartAlt, Save } from "@mui/icons-material";
import { TextField, InputAdornment } from "@mui/material";
import { Dispatch, FunctionComponent, SetStateAction } from "react";

export interface FileNameProps {
    fileNameState: string | undefined;
    setFileNameState: Dispatch<SetStateAction<string>>;
    isFileNameChanged: boolean;
    handleResetFileName: () => void;
    handleSaveFileName: () => void;
}

export const FileName: FunctionComponent<FileNameProps> = ({
    fileNameState,
    setFileNameState,
    isFileNameChanged,
    handleResetFileName,
    handleSaveFileName,
}) => {
    const isNewNameValid = !!(fileNameState && fileNameState.trim().length > 0);

    return (
        <TextField
            variant="standard"
            value={fileNameState}
            onChange={(e) => {
                if (!isNewNameValid) return;
                setFileNameState(e.target.value);
            }}
            error={!isNewNameValid}
            InputProps={{
                endAdornment: isFileNameChanged && (
                    <InputAdornment position="end">
                        <RestartAlt
                            onClick={handleResetFileName}
                            fontSize="small"
                            color="primary"
                            sx={{
                                cursor: "pointer",
                            }}
                        />
                        {isNewNameValid && (
                            <Save
                                onClick={handleSaveFileName}
                                fontSize="small"
                                color="primary"
                                sx={{
                                    cursor: "pointer",
                                }}
                            />
                        )}
                    </InputAdornment>
                ),
                onBlur: () => {
                    setFileNameState((v) => v.trim());
                },
            }}
        />
    );
};
