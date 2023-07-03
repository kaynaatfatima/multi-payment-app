import React from "react";
import {useLocation} from "react-router-dom";

interface IErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<IErrorPageProps> = () => {
  const location = useLocation();
  const message = location.state.message;
  return (
    <div className="error-page">
      <section className="dark-card shadow border">
        <h1 className="text-center mb-4">Error</h1>
        <p className="text-center h5 text-light">
          {message? message: "111 - Something went wrong"}
        </p>
        <button className="btn btn-primary btn-hover-shine btn-lg w-100 mt-3">
          GO TO HOME
        </button>
      </section>
    </div>
  );
};

export default ErrorPage;
