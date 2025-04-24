import React from "react";
import "./Loading.css"; // Ensure you have the spinner CSS

const Loading = () => (
  <div className="loading-spinner flex flex-col items-center text-[#062f2e]">
    <div className="spinner border-t-2 border-b-2 border-[#062f2e]"></div>
    Loading
  </div>
);

export default Loading;
