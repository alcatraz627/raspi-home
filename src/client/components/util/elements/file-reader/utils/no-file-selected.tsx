import { AddCircleOutline } from "@mui/icons-material";
import { Box, Button, Divider, Typography, BoxProps } from "@mui/material";
import { FunctionComponent } from "react";
import { UploadFile, UploadFileProps } from "../upload-file";

export interface NoFileSelectedProps {
    createNewFile: () => Promise<void>;
    uploadFile: UploadFileProps["uploadFile"];
    rootStyle?: BoxProps;
}

export const NoFileSelected: FunctionComponent<NoFileSelectedProps> = ({
    rootStyle,
    createNewFile,
    uploadFile,
}) => (
    <Box
        sx={{
            width: "100%",
            pt: 1,
            ...rootStyle,
        }}
    >
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <Typography variant="body1" color="gray">
                No file selected
                <br />
                <Button
                    sx={{ mt: 1 }}
                    variant="outlined"
                    onClick={createNewFile}
                >
                    <AddCircleOutline />
                    &nbsp; Create a file
                </Button>
            </Typography>
        </Box>
        <Divider
            sx={{
                my: 2,
                mx: "auto",
                width: "50%",
            }}
        />
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <UploadFile uploadFile={uploadFile} />
        </Box>
    </Box>
);
