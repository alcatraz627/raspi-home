import { Box, Button, Chip, Divider, Input, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { DirList } from "../components/directory/dir-list";
import { useServerData } from "../utils/use-server-data/use-server-data";
import { fetchServerDirectory, fetchServerFile } from "../api";

export const DirectoryPage: React.FunctionComponent = () => {
    const [pathString, setPathString] = useState<string>("");
    const [filePathString, setFilePathString] = useState<string | null>(null);
    // const [selectedDir, setSelectedDir] = useState<string | null>(null);

    const [dirData, dirActions, dirStatus] =
        useServerData(fetchServerDirectory);
    const [fileData, fileActions, fileStatus] = useServerData(fetchServerFile);

    const parsedPath = useMemo(() => {
        try {
            return pathString.split("/").filter((v) => v);
        } catch (error) {
            return [""];
        }
    }, [pathString]);

    const fetchDirContents = (path: string) => {
        dirActions.query(path);
    };

    useEffect(() => {
        fetchDirContents(pathString);
    }, []);

    const handleSelectFile = (
        newPath: string | ((v: string) => string) | null
    ): void => {
        const parsedNewPath =
            (typeof newPath === "function" ? newPath(pathString) : newPath) ||
            null;

        setFilePathString(parsedNewPath);
        if (parsedNewPath) {
            fileActions.query(parsedNewPath).then((data): void => {
                console.log("File", data);
            });
        }
    };
    const handleSelectFolder = (
        newPath: string | ((v: string) => string) | null
    ): void => {
        const parsedNewPath =
            (typeof newPath === "function" ? newPath(pathString) : newPath) ||
            "";

        setPathString(parsedNewPath);
        fetchDirContents(parsedNewPath);
    };

    return (
        <div>
            <Typography variant="h4">Directory</Typography>
            <Divider sx={{ my: 2 }} />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Input
                    fullWidth
                    placeholder="Enter path"
                    value={pathString}
                    onChange={(e) => setPathString(e.target.value)}
                />
                &nbsp;
                <Button variant="contained" onClick={() => fetchDirContents}>
                    Search
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {parsedPath.map((p) => (
                    <>
                        /
                        <Chip
                            label={p}
                            variant="outlined"
                            sx={{ mx: 0.5, my: 1 }}
                            size="small"
                        />
                    </>
                ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5">Tree</Typography>
            <Box display="flex" width="100%" flexDirection="row">
                <DirList
                    pathList={parsedPath}
                    folders={dirData?.directories || []}
                    selectFile={handleSelectFile}
                    selectFolder={handleSelectFolder}
                    files={dirData?.files || []}
                />
            </Box>

            <Divider sx={{ my: 2 }} />

            <pre>{JSON.stringify(filePathString)}</pre>
        </div>
    );
};
