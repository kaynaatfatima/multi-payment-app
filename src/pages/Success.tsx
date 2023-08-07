import React from "react";
import green_tick from "../assets/green-tick.png"

const Success: React.FC = () => {
  return (
    <div className="gradient-page">
      <section className="dark-card shadow border d-flex flex-column align-items-center justify-content-center p-5">
        <img
          src={green_tick}
          alt="Green tick"
          className="object-cover"
          style={{width: "120px"}}
        />
        <h1 className="text-center text- mb-4" style={{color: "#24cb02"}}>
          Success
        </h1>
        <p className="text-center h5 text-light">
          We recieved your payment request, we will send you confirmation email shortly
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
