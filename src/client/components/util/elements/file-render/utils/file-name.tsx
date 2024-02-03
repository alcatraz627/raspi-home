import { RestartAlt, Save } from "@mui/icons-material";
import { TextField, InputAdornment } from "@mui/material";
import { Dispatch, FunctionComponent, SetStateAction } from "react";

export interface FileNameProps {
    fileNameState: string | undefined;
    setFileNameState: Dispatch<SetStateAction<string>>;
    isNewNameValid: boolean;
    isFileNameChanged: boolean;
    handleResetFileName: () => void;
    handleSaveFileName: () => void;
}

export const FileName: FunctionComponent<FileNameProps> = ({
    fileNameState,
    setFileNameState,
    isNewNameValid,
    isFileNameChanged,
    handleResetFileName,
    handleSaveFileName,
}) => (
    <TextField
        variant="standard"
        value={fileNameState}
        onChange={(e) => {
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
