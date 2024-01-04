import { createContext, useContext, useState } from "react";

export type ValueOf<T> = T[keyof T];

export type GlobalContextState = {
    isDrawerOpen: boolean;
} & Record<string, any>;

export interface UseGlobalReturn {
    values: GlobalContextState;
    setValue: (
        key: keyof GlobalContextState,
        val: ValueOf<GlobalContextState>
    ) => void;
}

const initialState: GlobalContextState = {
    isDrawerOpen: false,
};

export const GlobalContext = createContext<UseGlobalReturn | null>(null);

export const useGlobal = (): UseGlobalReturn =>
    useContext(GlobalContext) ?? { values: initialState, setValue: () => {} };

export const useInitGlobalState = (): UseGlobalReturn => {
    const [state, setState] = useState<GlobalContextState>(initialState);

    const setValue: UseGlobalReturn["setValue"] = (key, value) => {
        setState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return {
        values: state,
        setValue,
    };
};
