import React from "react";

const Success: React.FC = () => {
  return (
    <div className="gradient-page">
      <section className="dark-card shadow border">
        <h1 className="text-center mb-4">Payment success</h1>
        <p className="text-center h5 text-light">
          Your payment has been recieved successfully 😃
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

export default Success;
