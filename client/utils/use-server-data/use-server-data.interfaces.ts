/*
 * Copyright 2023 StarTree Inc.
 *
 * All rights reserved. Confidential and proprietary information of StarTree Inc.
 */
import { AxiosError } from "axios";

export type Status = "idle" | "loading" | "success" | "error";

export type UseServerDataRequest<
    Response = Record<string, unknown>,
    Params = Record<string, unknown>,
> = (params: Params) => Promise<Response>;

export type UseServerDataResponse<Params, Response> = [
    data: Response | null,
    actions: {
        query: (params: Params) => Promise<Response>; // Fetched data from the server and updates the local state
        update: (data: Response) => void; // Updates the local state directly via passed parameters
        reset: () => void; // Clear the local state
    },
    status: {
        value: Status;
        isInitial: boolean;
        isLoading: boolean;
        isSuccess: boolean;
        isError: boolean;
    },
    error: AxiosError<{
        errorCode: string;
        message: string;
        status: number;
    }> | null,
];
