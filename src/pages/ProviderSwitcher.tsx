/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {IPaymentInformation} from "../utils/interfaces";
import {setPaymentInfo, setApiKey} from "../app/paymentApi/PaymentSlice";
import {useGetPaymentInformationQuery} from "../app/paymentApi/PaymentApiSlice";
import {useAppDispatch} from "../app/hooks";
import Loading from "./Loading";

const ProviderSwitcher: React.FC = () => {
  const queryParams = new URLSearchParams(location.search);
  const apiKey = queryParams.get("key");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  let paymentInformation: IPaymentInformation | undefined;
  let expiryDateTime: Date | undefined;
  const {data, isLoading, isError, error, isSuccess} =
    useGetPaymentInformationQuery(apiKey ?? "", {
      skip: !apiKey,
    });
  const handleOnError = (errMsg: string) => {
    navigate("/error", {
      state: {
        message: errMsg,
      },
    });
  };
  useEffect(() => {
    if (apiKey === undefined) {
      handleOnError("This payment does not exist");
    }
  }, [apiKey]);

  const handleOnSuccess = (paymentInfo: IPaymentInformation) => {
    if (paymentInfo.providerDetails.provider.toLowerCase() === "stripe") {
      navigate("/stripe-checkout", {
        state: {
          paymentInfo,
          apiKey,
        },
      });
    } else if (
      paymentInfo.providerDetails.provider.toLowerCase() === "checkout"
    ) {
      navigate("/checkout-dot-com-checkout", {
        state: {
          paymentInfo,
          apiKey,
        },
      });
    }
  };

  useEffect(() => {
    if (isLoading) {
      <Loading />;
    }
  }, [isLoading]);

  useEffect(() => {
    if (apiKey) {
      dispatch(setApiKey(apiKey));
    }
  }, [apiKey]);

  useEffect(() => {
    if (data && data.valid) {
      paymentInformation = data;
      if (paymentInformation) {
        expiryDateTime = new Date(paymentInformation?.paymentLinkExpiryDate);
        dispatch(setPaymentInfo(paymentInformation));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isError) {
      if ("status" in error) {

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
        handleOnError(error?.message as string);
      }
    }
  }, [isError, error]);

  // Handle success state
  useEffect(() => {
    if (isSuccess) {
      //if public key is invalid
      if (paymentInformation?.valid === false) {
        handleOnError("Invalid payment link");
      }
      //If payment link has expired
      else if (expiryDateTime === undefined || expiryDateTime < new Date()) {
        handleOnError("Payment link has expired");
      } else {
        handleOnSuccess(data);
      }
    }
  }, [isSuccess]);

  return isLoading ? (
    <Loading />
  ) : (
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
