/* eslint-disable @typescript-eslint/no-explicit-any */
import {BaseQueryFn, FetchArgs, createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

interface ICustomError {
  status?: number;
  data?: {
    error: any;
    valid: boolean;
    message?: string | null;
    paymentLinkExpiryDate: string | null;
    clientDetails: null;
    paymentDetails: null;
    providerDetails: null;
  };
}
const baseQuery = fetchBaseQuery({
  baseUrl: "https://sandbox-payments.xtrategise.net/api/",
}) as BaseQueryFn<string | FetchArgs, unknown, ICustomError, object>;

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
