import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IPaymentInformation} from "../../utils/interfaces";
import { PaymentMethod } from "@stripe/stripe-js";

interface PaymentState {
  provider?: IPaymentInformation["providerDetails"];
  client?: IPaymentInformation["clientDetails"];
  payment?: IPaymentInformation["paymentDetails"];
  valid?: boolean;
  paymentLinkExpiry?: string;
  apiKey?: string;
  pmId?: string;
  pmType?: string;
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
    setApiKey: (state, action: PayloadAction<string>) => {
      const apiKey = action.payload;
      state.apiKey = apiKey;
    },
    setPaymentMethodInfo: (state, action: PayloadAction<PaymentMethod>) => {
      console.log("payment method payload: ", action.payload)
      const {
        id, type
      } = action.payload;

      state.pmId = id;
      state.pmType = type;
    },
  },
});

export const {setPaymentInfo, clearPaymentInfo, setApiKey, setPaymentMethodInfo} = paymentSlice.actions;

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
export const selectApiKey = (state: {payment: PaymentState}) =>
  state.payment.apiKey;
export const selectPmId = (state: {payment: PaymentState}) =>
  state.payment.pmId;
export const selectPmType = (state: {payment: PaymentState}) =>
  state.payment.pmType;
