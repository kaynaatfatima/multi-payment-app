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
  
  //redirect to success or error page depending upon iframe response
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
