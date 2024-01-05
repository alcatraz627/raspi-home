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
