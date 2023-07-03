import { IPaymentInformation } from "../../utils/interfaces";
import {apiSlice} from "../apiSlice";

export const PaymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentInformation: builder.query<IPaymentInformation, string>({
      query: (publicKey: string) => ({
        url: `v1.0/payment-info/${publicKey}`,
        method: "GET",
      }),
    }),
  }),
});
export const {
    useGetPaymentInformationQuery
} = PaymentApiSlice;