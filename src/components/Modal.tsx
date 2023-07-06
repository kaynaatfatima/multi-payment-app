import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import {useNavigate} from "react-router-dom";

interface IModalProps {
  open: boolean;
  onClose: () => void;
  size?: string;
  iframeSrc: string | null;
}

const Modal: React.FC<IModalProps> = (props) => {
  const navigate = useNavigate();

  const handleCloseModal = () => {
    props.onClose();
    navigate("/error", {
      state: {
        message: "Authentication canceled or closed by the user.",
      },
    });
  };
  const handleFallback = () => {
    props.onClose();
    navigate("/error", {
      state: {
        message: "STRIPE 3DS FALLBACK.",
      },
    });
  }

  const handleOnError = (errMsg: string) => {
    console.log("handle on error: modal: ", errMsg);
    navigate("/error", {
      state: {
        message: errMsg,
      },
    });
  };

  useEffect(() => {
    if (props.iframeSrc === null) {
      handleOnError("No authentication link");
    }
  }, [props.iframeSrc]);

  useEffect(() => {
    const handle3DSecureMessage = (event: MessageEvent) => {
      // Ensure the message is from the 3DS iframe
      const iframe = document.getElementById("3ds-iframe") as HTMLIFrameElement;
      if (event.source !== iframe?.contentWindow) return;

      // Handle the message based on its content
      const message = event.data;
      console.log("3DS --- event", event);
      console.log("3DS --- mesg data", message);
      console.log("3DS --- mesg type", message.type); // stripe-3ds-fallback
      if (message.type === 'stripe-3ds-fallback') {
        handleFallback();
        props.onClose();
      } else if (message === "3DS_FAIL") {
        // 3DS authentication failed
        props.onClose();
      }
    };

    // Add the event listener to listen for messages
    window.addEventListener("message", handle3DSecureMessage);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("message", handle3DSecureMessage);
    };
  }, [props.onClose]);

  // Redirect to success or error page depending on iframe response
  if (!props.open) return null;

  return ReactDOM.createPortal(
    <>
      <div className="modal-overlay" onClick={handleCloseModal}>
        <div
          className={`modal-dialog modal-${props.size || "xxl"}`}
          role="document"
          onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            {props.iframeSrc && (
              <div className="modal-body">
                <iframe
                  id="3ds-iframe"
                  src={props.iframeSrc}
                  title="External Content"
                  className="w-100"
                  style={{minHeight: "85vh"}}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal") as Element | DocumentFragment
  );
};

export default Modal;
