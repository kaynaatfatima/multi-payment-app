import React from "react";
import {useLocation, Link} from "react-router-dom";

interface IErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<IErrorPageProps> = () => {
  const location = useLocation();
  const message = location.state?.message;
  return (
    <div className="gradient-page">
      <section className="dark-card shadow border">
        <h1 className="text-center mb-4">Error</h1>
        <p className="text-center h5 text-light">
          {message? message: "111 - Something went wrong"}
        </p>
        <Link className="btn btn-primary btn-hover-shine btn-lg w-100 mt-3" to="https://xtrategise.com">
          GO TO HOME
        </Link>
      </section>
    </div>
  );
};

export default ErrorPage;
