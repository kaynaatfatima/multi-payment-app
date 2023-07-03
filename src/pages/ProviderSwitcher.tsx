/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {IPaymentInformation} from "../utils/interfaces";
import {setPaymentInfo} from "../app/paymentApi/PaymentSlice";
import {useGetPaymentInformationQuery} from "../app/paymentApi/PaymentApiSlice";
import {useAppDispatch} from "../app/hooks";
import Loading from "./Loading";

interface APIRequestParams extends Record<string, string | undefined> {
  apiKey: string;
}

const ProviderSwitcher: React.FC = () => {
  const {apiKey} = useParams<APIRequestParams>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  let paymentInformation: IPaymentInformation | undefined;
  let expiryDateTime: Date | undefined;
  const {data, isLoading, isError, error, isSuccess} =
    useGetPaymentInformationQuery(apiKey ?? "", {
      skip: !apiKey,
    });
  const handleOnError = (errMsg: string) => {
    console.log("handle on error: ", errMsg)
    navigate("/error", {
      state: {
        message: errMsg,
      },
    });
  };

  const handleOnSuccess = (paymentInfo: IPaymentInformation) => {
    console.log("handle on error: ", paymentInfo);
    if(paymentInfo.providerDetails.provider.toLowerCase() === "stripe"){
      navigate("/stripe-checkout", {
        state: {
          paymentInfo,
          apiKey,
        },
      });
    } else if(paymentInfo.providerDetails.provider.toLowerCase() === "checkout"){
      navigate("/checkout-dot-com-checkout", {
        state: {
          paymentInfo,
          apiKey,
        },
      });
    }
    
  };

  useEffect(() => {
    if(isLoading){
      <Loading />;
    }
  }, [isLoading])
  

  useEffect(() => {
    if (data && data.valid) {
      paymentInformation = data;
      expiryDateTime = new Date(paymentInformation.paymentLinkExpiryDate);
      console.log(paymentInformation);
      dispatch(setPaymentInfo(paymentInformation));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isError) {
      console.log("ERROR 1", error)
      if ("status" in error) {
      console.log("ERROR 2", error);

        const errMsg =
          "error" in error
            ? (error.error as string)
            : "message" in error
            ? (error.message as string)
            : "data" in error
            ? (error.data?.message as string)
            : JSON.stringify(error);

        handleOnError(errMsg);
      } else {
      console.log("ERROR 3", error);

        handleOnError(error?.message as string);
      }
    }
  }, [isError, error]);

  // Handle success state
  useEffect(() => {
    if (isSuccess) {
      //if public key is invalid
      if (paymentInformation?.valid === false) {
      console.log("ERROR 4 - invalid");

        handleOnError("Invalid payment link");
      }
      //If payment link has expired
      else if (expiryDateTime === undefined || expiryDateTime < new Date()) {
      console.log("ERROR 5 - expired");

        handleOnError("Payment link has expired");
      }
      else{
        handleOnSuccess(data)
      }
    }
  }, [isSuccess]);

  return isLoading? <Loading /> : (
    <div>
      {data && (
        <div>
          <h1>Redirecting to checkout...</h1>
          {/* <p>{JSON.stringify(data)}</p> */}
          <h4>{new Date().toISOString()}</h4>
        </div>
      )}
    </div>
  );
};

export default ProviderSwitcher;
