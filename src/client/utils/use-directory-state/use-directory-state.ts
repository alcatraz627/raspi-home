import { useLocalStorage } from "../use-local-storage/use-local-storage";

export const DIRECTORY_STATE = "directoryState";

export type DirectoryData = {
    lastOpenFile: string | null;
};

export type DirectoryState = Record<string, DirectoryData | undefined>;

export type UseDirectoryStateReturn = [
    DirectoryState,
    (dirPath: string, newDirData: DirectoryData) => void,
];

export const useDirectoryState = (): UseDirectoryStateReturn => {
    const initialValue: DirectoryState = {};
    const [get, set] = useLocalStorage(DIRECTORY_STATE, initialValue);

    const directoryState: DirectoryState = get || {};

    const setDirectoryState = (
        dirPath: keyof DirectoryState,
        newDirData:
            | DirectoryData
            | ((existing: DirectoryState[string]) => DirectoryData)
    ) => {
        let existingData = get || {};
        let finalData = newDirData;

        if (typeof finalData === "function") {
            finalData = finalData(existingData[dirPath]);
        }

        set({ ...existingData, [dirPath]: finalData });
    };

    return [directoryState, setDirectoryState];
};
