import { useSearchParams } from "react-router-dom";

export type UseQueryParamReturn = [
    string | null,
    (newValue: string) => void,
    () => void,
];

export const useQueryParamKey = (key: string): UseQueryParamReturn => {
    const [searchParams, setSearchParam] = useSearchParams();
    const value = searchParams.get(key);

    const setValue = (newValue: string) => {
        searchParams.set(key, newValue);
        setSearchParam(searchParams);
    };

    const deleteValue = () => {
        searchParams.delete(key);
        setSearchParam(searchParams);
    };

    return [value, setValue, deleteValue];
};
