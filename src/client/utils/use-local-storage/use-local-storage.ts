import { isNull } from "lodash";
import { useEffect, useState } from "react";
import { DIRECTORY_STATE } from "../use-directory-state/use-directory-state";

export type UseLocalStorageReturn<T> = [T | undefined, (newValue: T) => void];

export type LocalStorageKey = typeof DIRECTORY_STATE;

export const useLocalStorage = <T = string>(
    key: LocalStorageKey,
    initialValue?: T
): UseLocalStorageReturn<T> => {
    // Get data from localStorage on initial render
    const storedValue = localStorage.getItem(key);
    const initial = storedValue ? (JSON.parse(storedValue) as T) : initialValue;

    // State to hold the current value
    const [value, setValue] = useState<T | undefined>(initial);

    useEffect(() => {
        const storedVal = localStorage.getItem(key);
        if (isNull(storedVal)) {
            localStorage.setItem(key, JSON.stringify(initialValue));
        }
    }, []);

    // Update localStorage and state when the value changes
    const setStoredValue = (newValue: T) => {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
    };

    return [value, setStoredValue];
};
