export const truncate = <
    T extends string | any,
    R = T extends string ? string : T,
>(
    text: T,
    length: number = 16
): R => {
    if (typeof text !== "string") return text as unknown as R;

    if (text.length <= length) {
        return text as R;
    }
    return (text.substring(0, length) + "...") as R;
};
