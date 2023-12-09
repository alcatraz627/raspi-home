import { ListDirResponse, GetFileResponse } from "@/server/routes/api/browse";
import axios from "axios";

export const fetchServerDirectory = async (dirPath = "/") =>
    (await axios.get<ListDirResponse>(`/api/browse${dirPath}`)).data;

export const fetchServerFile = async (dirPath = "/") => {
    const resp = await axios.get<GetFileResponse>(`/api/browse${dirPath}`);
    return { file: resp.data, contentType: resp.headers["content-type"] };
};
