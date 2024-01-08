import { dir } from "console";
import {
    UseLocalStorageReturn,
    useLocalStorage,
} from "../use-local-storage/use-local-storage";

export type DirectoryState = {
    directoryPath: string;
    lastOpenFile: string | null;
};

export type UseDirectoryStateReturn = [
    Record<string, DirectoryState["lastOpenFile"]>,
    (dirPath: string, newValue: DirectoryState["lastOpenFile"]) => void,
];

export const DIRECTORY_STATE = "directoryState";

export const useDirectoryState = (): UseDirectoryStateReturn => {
    const initialValue: DirectoryState[] = [];
    const [get, set] = useLocalStorage(DIRECTORY_STATE, initialValue);

    const directoryState = Object.assign(
        {},
        ...(get || []).map(({ directoryPath, lastOpenFile }) => ({
            [directoryPath]: lastOpenFile,
        }))
    );
    const setDirectoryState = (
        key: string,
        value: DirectoryState["lastOpenFile"]
    ) => {
        set([
            ...get!.filter(({ directoryPath }) => directoryPath !== key),
            { directoryPath: key, lastOpenFile: value },
        ]);
    };

    return [directoryState, setDirectoryState];
};
