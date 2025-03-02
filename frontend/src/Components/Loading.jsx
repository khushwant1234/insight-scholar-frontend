import React from "react";
import "./Loading.css"; // Ensure you have the spinner CSS

const Loading = () => (
  <div className="loading-spinner flex flex-col">
    <div className="spinner"></div>
    Loading
  </div>
);

export default Loading;
