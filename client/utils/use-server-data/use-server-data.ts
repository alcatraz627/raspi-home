/*
 * Copyright 2023 StarTree Inc.
 *
 * All rights reserved. Confidential and proprietary information of StarTree Inc.
 */
import { useMemo, useState } from "react";
import {
    UseServerDataRequest,
    UseServerDataResponse,
    Status,
} from "./use-server-data.interfaces";

/**
 * A hook to fetch data from the server and manage it locally.
 *
 * @type `Param` The type of the parameters to pass to the query function
 * @type `Response` The type of the response from the server
 *
 * @param queryFn The function to call to fetch the data from the server.
 * Any function that makes an async call and returns data will do.
 * This means that wrapper functions that only need part of the payload
 * for an API call work just as well. Accepts <Param>parameters.
 *
 * @returns An object with `<Response>data`, `actions` to update the data, and `status` flags.
 *
 * - actions.`query`(queryFn: Params) will re-run the `queryFn`
 * - actions.`reset`() will clear the previously fetched data.
 * - actions.`update`(data: Response) can update the local data directly without calling `queryFn`.
 * Helpful when direct local updates are needed, like in the case of row deletion / update, where
 * an extra API call every time wouldn't be necessary
 *
 */

export const useServerData = <
    Response = Record<string, unknown>,
    Params = Record<string, unknown>,
>(
    queryFn: UseServerDataRequest<Response, Params>
): UseServerDataResponse<Params, Response> => {
    const [status, setStatus] = useState<Status>("idle");
    const [data, setData] = useState<Response | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const query = async (queryParamsProp: Params): Promise<Response> => {
        setStatus("loading");
        setError(null);

        try {
            const response = await queryFn(queryParamsProp);
            setData(response);
            setStatus("loading");

            return response;
        } catch (error) {
            setStatus("error");
            setError(error as Error);

            throw error as Error;
        }
    };

    const update = (newData: Response): void => {
        setData(newData);
        setStatus("success");
        setError(null);
    };

    const reset = (): void => {
        setData(null);
        setStatus("idle");
        setError(null);
    };

    const statusFlags = useMemo(
        () => ({
            isInitial: status === "idle",
            isLoading: status === "loading",
            isError: status === "error",
            isSuccess: status === "success",
            value: status,
        }),
        [status]
    );

    return [
        data,
        { query, update, reset },
        statusFlags,
        error,
    ] as UseServerDataResponse<Params, Response>;
};
