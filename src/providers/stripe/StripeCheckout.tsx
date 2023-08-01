import React, {useState, useEffect} from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {useAppSelector} from "../../app/hooks";
import {
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
  loadStripe,
} from "@stripe/stripe-js";
import gradient_bg from "../../assets/gradient-bg.png";
import iol_logo from "../../assets/iol-logo.svg";
import {useLocation} from "react-router-dom";
import {
  IPaymentInformation,
  IPaymentMethodQueryObject,
  IPaymentStatus,
} from "../../utils/interfaces";
import {useNavigate} from "react-router-dom";
import {useGetPaymentStatusMutation} from "../../app/paymentApi/PaymentApiSlice";
import {useAppDispatch} from "../../app/hooks";
import {setPaymentMethodInfo} from "../../app/paymentApi/PaymentSlice";

const CheckoutForm: React.FC = () => {
  const location = useLocation();
  const paymentInfo: IPaymentInformation | undefined =
    location.state?.paymentInfo;
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<IPaymentStatus | null>(
    null
  );
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [cardNumberError, setCardNumberError] = useState<string>("");
  const [cvcError, setCvcError] = useState<string>("");
  const [expiryError, setExpiryError] = useState<string>("");
  const [stripeValidationError, setStripeValidationError] =
    useState<boolean>(true);

  const apiKey = useAppSelector((state) => state.payment.apiKey);
  const dispatch = useAppDispatch();

  const [
    getPaymentStatus,
    {isSuccess: isPaymentStatusSuccess, isLoading: isPaymentStatusLoading},
  ] = useGetPaymentStatusMutation();

  const handleOnError = (errMsg: string) => {
    navigate("/error", {
      state: {
        message: errMsg,
      },
    });
  };

  useEffect(() => {
    if (!paymentInfo) handleOnError("Oops! This page has restricted access.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentInfo]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPaymentSuccess(false);
      setPaymentError(null);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [paymentError, paymentSuccess]);

  // Form validations

  // Card name
  const validateName = (value: string) => {
    if (value.trim() === "") {
      setNameError("Name cannot be blank");
    } else {
      const regex = /^[A-Za-z\s]+$/;
      if (!regex.test(value)) {
        setNameError(
          "Invalid name format. Only letters (A-Z, a-z) are allowed."
        );
      } else {
        setNameError("");
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setName(value);
    validateName(value);
  };

  //  Card number
  const handleCardNumberChange = (
    event: StripeCardNumberElementChangeEvent
  ) => {
    const {error} = event;
    if (error) {
      setCardNumberError(error.message);
    } else {
      setCardNumberError("");
    }
  };
  // CVC
  const handleCvcChange = (event: StripeCardCvcElementChangeEvent) => {
    const {error} = event;
    if (error) {
      setCvcError(error.message);
    } else {
      setCvcError("");
    }
  };
  // Expiry Date
  const handleExpiryChange = (event: StripeCardExpiryElementChangeEvent) => {
    const {error} = event;
    if (error) {
      setExpiryError(error.message);
    } else {
      setExpiryError("");
    }
  };

  useEffect(() => {
    if (
      nameError !== "" ||
      cardNumberError !== "" ||
      cvcError !== "" ||
      expiryError !== "" ||
      name === ""
    ) {
      setStripeValidationError(true);
      console.log("TRUE");
    } else {
      setStripeValidationError(false);
    }
  }, [nameError, cardNumberError, cvcError, expiryError, name, elements]);

  // Form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    validateName(name);
    setButtonLoading(true);
    if (stripeValidationError) {
      return;
    }
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardNumberElement);
    if (cardElement) {
      const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name,
          address: {
            line1: paymentInfo?.clientDetails.address,
          },
          email: paymentInfo?.paymentDetails.payer.email,
        },
      });

      if (error) {
        setPaymentError(error.message || null);
        setPaymentSuccess(false);
      } else {
        dispatch(setPaymentMethodInfo(paymentMethod));

        const paymentKeys: IPaymentMethodQueryObject = {
          key: apiKey,
          mode: paymentMethod.type,
          paymentMethod: paymentMethod.id,
        };
        const response = await getPaymentStatus(paymentKeys);

        if ("data" in response) {
          if (response.data.success) {
            navigate("/success");
          } else {
            setPaymentStatus(response.data);
            if (
              paymentMethod.card &&
              paymentMethod.card.three_d_secure_usage?.supported
            ) {
              const {error} = await stripe.confirmPayment({
                clientSecret: response.data.clientSecret,
                confirmParams: {
                  return_url: `${window.location.origin}/success`,
                },
              });
              if (error) {
                handleOnError(error.message || "");
              }
            } else {
              navigate("/success");
            }
          }
        } else {
          if ("data" in response.error && response.error.data) {
            handleOnError(JSON.stringify(response.error.data.error));
          } else {
            handleOnError(JSON.stringify(response.error));
          }
        }
      }
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    if (isPaymentStatusSuccess && paymentStatus?.success) {
      navigate("/success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaymentStatusSuccess, paymentStatus]);

  return (
    paymentInfo && (
      <>
        <div
          style={{
            background:
              "linear-gradient(70deg, rgba(29,29,29,1) 25%, rgba(230,230,230,1) 25%)",
          }}
          className="checkout-page d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex flex-row flex-wrap-reverse p-4 m-2 rounded-2 shadow bg-white">
            <form
              onSubmit={handleSubmit}
              className="checkout-form col-md-6 px-2 px-md-4">
              <div className="divider d-block d-md-none"></div>
              <h3 className="mb-3 mt-2">Payment Details</h3>
              <div className="form-row mb-3">
                <label>Card Holder Name</label>
                <input
                  style={{textTransform: "uppercase"}}
                  className={`form-control ${nameError ? "border-danger" : ""}`}
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e)}
                  placeholder="Name on card"
                />
                {nameError && (
                  <em className="error invalid-feedback">{nameError}</em>
                )}
              </div>
              <div className="form-row mb-3">
                <label>Card Number</label>
                <CardNumberElement
                  className={`form-control ${
                    cardNumberError ? "border-danger" : ""
                  }`}
                  onChange={(e) => handleCardNumberChange(e)}
                />
                {cardNumberError && (
                  <em className="error invalid-feedback">{cardNumberError}</em>
                )}
              </div>
              <div className="form-row mb-3">
                <label>CVC</label>
                <CardCvcElement
                  className={`form-control ${cvcError ? "border-danger" : ""}`}
                  onChange={(e) => handleCvcChange(e)}
                />
                {cvcError && (
                  <em className="error invalid-feedback">{cvcError}</em>
                )}
              </div>
              <div className="form-row mb-3">
                <label>Expiry Date</label>
                <CardExpiryElement
                  className={`form-control ${
                    expiryError ? "border-danger" : ""
                  }`}
                  onChange={(e) => handleExpiryChange(e)}
                />
                {expiryError && (
                  <em className="error invalid-feedback">{expiryError}</em>
                )}
              </div>

              <div className="divider my-4"></div>
              <div className="form-row mb-2">
                <label className="mr-3">Total Amount:</label>
                <span>
                  {paymentInfo.paymentDetails.currency +
                    " " +
                    paymentInfo.paymentDetails.amount.toLocaleString()}
                </span>
              </div>
              <button
                className="btn btn-secondary btn-lg w-100 btn-hover-shine"
                type="submit"
                disabled={
                  !stripe ||
                  buttonLoading ||
                  isPaymentStatusLoading ||
                  stripeValidationError
                }>
                {buttonLoading || isPaymentStatusLoading
                  ? "Processing Payment"
                  : "Make Payment"}
              </button>
            </form>

            <div className="detail-section col-md-6 mb-3">
              {paymentInfo.clientDetails.logo && (
                <img
                  src={paymentInfo?.clientDetails?.logo}
                  className="mx-auto mb-2"
                  style={{maxWidth: "100%", maxHeight: "2rem"}}
                />
              )}
              <div className="image-div">
                <img
                  src={paymentInfo.clientDetails.bodyImage || gradient_bg}
                  alt="gradient bg"
                  className="object-cover w-100 rounded-top"
                  style={{height: "320px"}}
                />
              </div>
              <div className="sub-section position-relative bg-light px-4 pb-2 rounded-bottom">
                <div className="pt-3">
                  {paymentInfo.paymentDetails.description && (
                    <p className="text-justify">
                      {paymentInfo.paymentDetails.description}
                      <br />
                    </p>
                  )}
                  <p className="text-center">
                    <b>Powered by </b>{" "}
                    <img
                      src={iol_logo}
                      className="d-inline mx-2"
                      alt="iOL Pay"
                      style={{height: "1rem"}}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {paymentError && (
          <div className="notification text-white bg-danger rounded-1 shadow error-message">
            Error: {" " + paymentError}
          </div>
        )} */}
        {paymentSuccess && (
          <div className="notification text-white bg-success rounded-1 shadow success-message">
            Payment Successful!
          </div>
        )}
      </>
    )
  );
};

const StripeCheckout: React.FC = () => {
  const publicKey = useAppSelector((state) => state.payment.provider?.key);
  const stripePromise = loadStripe(publicKey || "");

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeCheckout;
