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
import {loadStripe} from "@stripe/stripe-js";
import gradient_bg from "../../assets/gradient-bg.png";
import shape_vector from "../../assets/shape-vector.png";
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
import Modal from "../../components/Modal";

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
  const [open3DSecureModal, setOpen3DSecureModal] = useState<boolean>(false);
  const [threeDSecureLink, setThreeDSecureLink] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<IPaymentStatus | null>(
    null
  );
  const [name, setName] = useState<string>("");
  const apiKey = useAppSelector((state) => state.payment.apiKey);
  const dispatch = useAppDispatch();

  const [
    getPaymentStatus,
    {
      error: paymentStatusError,
      isError: isPaymentStatusError,
      isSuccess: isPaymentStatusSuccess,
      isLoading: isPaymentStatusLoading,
    },
  ] = useGetPaymentStatusMutation();

  const handleOnError = (errMsg: string) => {
    console.log("handle on error: ", errMsg);
    navigate("/error", {
      state: {
        message: errMsg,
      },
    });
  };

  useEffect(() => {
    if (!paymentInfo) handleOnError("Oops! This page has restricted access.");
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPaymentSuccess(false);
      setPaymentError(null);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [paymentError, paymentSuccess]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setButtonLoading(true);
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
        console.error("Error:", error.message);
        setPaymentError(error.message || null);
        setPaymentSuccess(false);
      } else {
        console.log("Payment Method:", JSON.stringify(paymentMethod));
        console.log("apikey: ", apiKey);
        dispatch(setPaymentMethodInfo(paymentMethod));

        const paymentKeys: IPaymentMethodQueryObject = {
          key: apiKey,
          mode: paymentMethod.type,
          paymentMethod: paymentMethod.id,
        };
        console.log("payment keys: ", paymentKeys);
        const response = await getPaymentStatus(paymentKeys);

        // Store the result in paymentStatus
        if ("data" in response) {
          setPaymentStatus(response.data);
        } else {
          console.log("reposnse err: ", JSON.stringify(response));
          console.log("reposnse err2: ", response);
          // handleOnError(response?.error?.)
        }
      }
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    console.log("error", paymentStatusError);
    console.log("isError", isPaymentStatusError);
    console.log("success", isPaymentStatusSuccess);

    if (isPaymentStatusSuccess && paymentStatus?.success) {
      console.log("yooo");
      navigate("/success");
    } else if (isPaymentStatusSuccess && !paymentStatus?.success) {
      console.log("second link");
      setThreeDSecureLink(paymentStatus?.nextActionUrl as string);
      setOpen3DSecureModal(true);
    }
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
          {paymentInfo.clientDetails.logo && (
            <img src={paymentInfo?.clientDetails?.logo} alt="" />
          )}
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
                  className="form-control"
                  type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="JOHN DOE"
                  required
                />
              </div>
              <div className="form-row mb-3">
                <label>Card Number</label>
                <CardNumberElement className="form-control" />
              </div>
              <div className="form-row mb-3">
                <label>Expiry Date</label>
                <CardExpiryElement className="form-control" />
              </div>
              <div className="form-row mb-3">
                <label>CVV</label>
                <CardCvcElement className="form-control" />
              </div>
              <div className="divider my-4"></div>
              <div className="form-row mb-2">
                <label className="mr-3">Total Amount:</label>
                <span>
                  {paymentInfo.paymentDetails.currency +
                    " " +
                    paymentInfo.paymentDetails.amount}
                </span>
              </div>
              <button
                className="btn btn-secondary btn-lg w-100 btn-hover-shine"
                type="submit"
                disabled={!stripe || buttonLoading || isPaymentStatusLoading}>
                {buttonLoading || isPaymentStatusLoading
                  ? "Loading..."
                  : "Make Payment"}
              </button>
            </form>

            <div className="detail-section col-md-6 mb-3">
              <div className="image-div">
                <img
                  src={paymentInfo.clientDetails.bodyImage || gradient_bg}
                  alt="gradient bg"
                  className="object-cover w-100 rounded-top"
                  style={{height: "320px"}}
                />
              </div>
              <div className="sub-section position-relative bg-light px-4 pb-2 rounded-bottom">
                <div className="price-info-card shadow d-flex flex-row position-absolute rounded-2">
                  <img
                    src={paymentInfo.clientDetails.logo || shape_vector}
                    alt="shape vector"
                    className="col-5 p-2 object-cover"
                  />
                  <div className="d-flex flex-column border-rounded-1 col-7 justify-content-center align-items-center">
                    <p className="text-dark my-auto">
                      <b>
                        {paymentInfo.paymentDetails.currency +
                          " " +
                          paymentInfo.paymentDetails.amount}
                      </b>
                    </p>
                  </div>
                </div>
                {paymentInfo.paymentDetails.description && (
                  <>
                    <h4 className="text-center" style={{paddingTop: "11%"}}>
                      Payment details
                    </h4>
                    <p className="text-justify">
                      {paymentInfo.paymentDetails.description}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {paymentError && (
          <div className="notification text-white bg-danger rounded-1 shadow error-message">
            Error: {" " + paymentError}
          </div>
        )}
        {paymentSuccess && (
          <div className="notification text-white bg-success rounded-1 shadow success-message">
            Payment Successful!
          </div>
        )}
        {open3DSecureModal && (
          <Modal
            open={open3DSecureModal}
            onClose={() => setOpen3DSecureModal(false)}
            iframeSrc={threeDSecureLink}
          />
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
