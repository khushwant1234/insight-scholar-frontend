import React from "react";
import { Link } from "react-router-dom";
import FadeWrapper from "./fadeIn";

const PageNotFound = () => {
  return (
    <FadeWrapper>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(to bottom right, #062f2e, #062f2e99)`,
          color: "#fff",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
        <h2 style={{ fontSize: "2rem", margin: "10px 0" }}>Page Not Found</h2>
        <p style={{ fontSize: "1.2rem", margin: "20px 0" }}>
          Oops! The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#a08961",
            color: "#fff",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
        >
          Go Back Home
        </Link>
      </div>
    </FadeWrapper>
  );
};

export default PageNotFound;
