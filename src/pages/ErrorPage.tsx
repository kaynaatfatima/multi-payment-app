import React from "react";
import {useLocation, Link} from "react-router-dom";
import red_error from "../assets/red-error.png"

interface IErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<IErrorPageProps> = () => {
  const location = useLocation();
  const message = location.state?.message;
  return (
    <div className="gradient-page">
      <section className="dark-card shadow border d-flex flex-column align-items-center justify-content-center p-5">
        <img
          src={red_error}
          alt="Green tick"
          className="object-cover mb-3"
          style={{width: "150px"}}
        />
        <h1 className="text-center mb-4" style={{color: "rgb(255,70,70)"}}>
          Error{" "}
        </h1>
        <p className="text-center h5 text-light">
          {message && message !== "" ? message : "Something went wrong"}
        </p>
        {/* <Link
          className="btn btn-primary btn-hover-shine btn-lg w-100 mt-3"
          to="https://xtrategise.com">
          GO TO HOME
        </Link> */}
      </section>
    </div>
  );
};

export default ErrorPage;
