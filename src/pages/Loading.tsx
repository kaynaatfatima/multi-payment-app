import React from 'react'
import ReactLoading from "react-loading";

const Loading: React.FC = () => {
  return (
    <>
      <div className="loading-main-bg">
        <ReactLoading type="cylon" color="#f26625" height={200} width={200} />
      </div>
    </>
  );
}

export default Loading