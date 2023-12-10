import {
    ListDirResponse,
    GetFileResponse,
    MoveFileResponse,
} from "@/server/routes/api/browse";
import axios from "axios";

export const fetchServerDirectory = async (dirPath = "/") =>
    (await axios.get<ListDirResponse>(`/api/browse${dirPath}`)).data;

export const fetchServerFile = async (filePath = "/") => {
    const resp = await axios.get<GetFileResponse>(`/api/browse${filePath}`, {
        responseType: "text",
    });
    return { file: resp.data, contentType: resp.headers["content-type"] };
};

export const moveServerFile = async (filePath: string, newFilePath: string) => {
    const resp = await axios.patch<MoveFileResponse>(
        `/api/browse${filePath}`,
        null,
        {
            params: {
                newPath: newFilePath,
            },
        }
    );
    return resp.data;
};
