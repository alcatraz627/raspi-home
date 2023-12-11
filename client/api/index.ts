import {
    ListDirResponse,
    GetFileResponse,
    MoveFileResponse,
} from "@/server/routes/api/browse";
import axios from "axios";

export const fetchServerDirectory = async (dirPath = "/") =>
    (await axios.get<ListDirResponse>(`/api/browse/${dirPath}`)).data;

export const fetchServerFile = async (filePath: string) => {
    const resp = await axios.get<GetFileResponse>(`/api/browse/${filePath}`, {
        responseType: "text",
    });
    return { file: resp.data, contentType: resp.headers["content-type"] };
};

export const createServerFile = async (filePath: string) => {
    const resp = await axios.post<GetFileResponse>(`/api/browse/${filePath}`);
    return resp.data;
};

export const moveServerFile = async (filePath: string, newFilePath: string) => {
    const resp = await axios.patch<MoveFileResponse>(
        `/api/browse/${filePath}`,
        null,
        {
            params: {
                newPath: newFilePath,
            },
        }
    );
    return resp.data;
};

export const deleteServerFile = async (filePath: string): Promise<void> => {
    await axios.delete(`/api/browse${filePath}`);
};
