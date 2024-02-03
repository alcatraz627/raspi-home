import { useNotify } from "@/client/utils/use-notify/notify-provider.component";
import { Close, CloudUpload, Publish } from "@mui/icons-material";
import { Button, Chip, Grid } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";

export interface UploadFileProps {
    uploadFile: (files: TFile[]) => Promise<void>;
}

export type TFile = File & { path: string };
export type TFileState = Record<string, TFile>;

export const UploadFile: FunctionComponent<UploadFileProps> = ({
    uploadFile,
}) => {
    const [uploadedFiles, setUploadedFiles] = useState<TFileState>({});
    const { notify } = useNotify();

    const onDrop = (acceptedFiles: TFile[]) => {
        setUploadedFiles(
            (state) =>
                Object.assign(
                    {},
                    state,
                    ...acceptedFiles.map((file) => ({ [file.path]: file }))
                ) as TFileState
        );
    };

    const { getRootProps, getInputProps } = useDropzone({
        // @ts-ignore
        onDrop,
        multiple: false,
    });

    const handleSubmit = async () => {
        if (uploadedFiles) {
            try {
                await uploadFile(Object.values(uploadedFiles));
                notify({ message: "File uploaded successfully" });
                setUploadedFiles({});
            } catch (err) {
                console.error(err);
                notify({ message: "Error: " + err });
            }
        }
    };

    const handleRemoveFile = (filePath: string) => {
        setUploadedFiles((state) => {
            const newState = structuredClone(state);
            delete newState[filePath];

            return newState;
        });
    };

    const areFilesSelected = Object.keys(uploadedFiles).length > 0;

    return (
        <Grid container>
            <Grid item {...getRootProps({ className: "dropzone" })} xs={12}>
                <Button
                    component="label"
                    variant="outlined"
                    color="primary"
                    startIcon={<CloudUpload />}
                >
                    {areFilesSelected ? "Upload more files" : "Upload file"}
                    <input {...getInputProps()} />
                </Button>{" "}
            </Grid>
            <Grid item xs={12} justifyContent="center" sx={{ my: 2 }}>
                {Object.values(uploadedFiles).map((file, idx) => (
                    <Chip
                        key={file.path}
                        size="small"
                        label={file.path}
                        deleteIcon={<Close />}
                        onDelete={() => handleRemoveFile(file.path)}
                        component="div"
                        sx={{
                            mt: 0.5,
                            mx: 0.5,
                        }}
                    />
                ))}
            </Grid>
            <Grid item xs={12}>
                {areFilesSelected && (
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<Publish />}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};
