import { createContext, useContext, useState } from "react";
import { GlobalContextState, UseGlobalReturn } from "./use-global.types";
import { initialState } from "./initial-state";

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
