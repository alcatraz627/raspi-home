import { useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";

export const useIsMobile = (width = 1440) => {
    const isMobile = useMediaQuery(`(max-width: ${width}px)`);
    return isMobile;
};

export const useMounted = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted;
};
