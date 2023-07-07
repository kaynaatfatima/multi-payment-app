import {BaseQueryFn, FetchArgs, createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";


const baseQuery = fetchBaseQuery({
  baseUrl: "https://sandbox-payments.xtrategise.net/api/",
}) as unknown as BaseQueryFn<string | FetchArgs, unknown, any, object>;

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
