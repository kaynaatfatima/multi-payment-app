import {IPaymentInformation, IPaymentMethodQueryObject, IPaymentStatus} from "../../utils/interfaces";
import {apiSlice} from "../apiSlice";

export const PaymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentInformation: builder.query<IPaymentInformation, string>({
      query: (apiKey: string) => ({
        url: `v1.0/payment-info/${apiKey}`,
        method: "GET",
      }),
    }),
    getPaymentStatus: builder.mutation<
      IPaymentStatus,
      IPaymentMethodQueryObject
    >({
      query: (payload) => ({
        url: "v1.0/payment",
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetPaymentInformationQuery,
  useGetPaymentStatusMutation,
} = PaymentApiSlice;
