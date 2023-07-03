import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IPaymentInformation} from "../../utils/interfaces";

interface PaymentState {
  provider?: IPaymentInformation["providerDetails"];
  client?: IPaymentInformation["clientDetails"];
  payment?: IPaymentInformation["paymentDetails"];
  valid?: boolean;
  paymentLinkExpiry?: string;
}

const initialState: PaymentState = {};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentInfo: (state, action: PayloadAction<IPaymentInformation>) => {
      const {
        providerDetails,
        clientDetails,
        paymentDetails,
        valid,
        paymentLinkExpiryDate,
      } = action.payload;

      state.provider = providerDetails;
      state.client = clientDetails;
      state.payment = paymentDetails;
      state.valid = valid;
      state.paymentLinkExpiry = paymentLinkExpiryDate;
    },
    clearPaymentInfo: () => {
      // Reset the state to an empty object
      localStorage.clear();
      return initialState;
    },
  },
});

export const {setPaymentInfo, clearPaymentInfo} = paymentSlice.actions;

export default paymentSlice.reducer;

export const selectProviderDetail = (state: {payment: PaymentState}) =>
  state.payment.provider;
export const selectClientDetail = (state: {payment: PaymentState}) =>
  state.payment.client;
export const selectPaymentDetail = (state: {payment: PaymentState}) =>
  state.payment.payment;
export const selectValidity = (state: {payment: PaymentState}) =>
  state.payment.valid;
export const selectPaymentLinkExpiry = (state: {payment: PaymentState}) =>
  state.payment.paymentLinkExpiry;
