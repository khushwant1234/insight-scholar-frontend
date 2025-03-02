import React from "react";
import { Link } from "react-router-dom";
import FadeWrapper from "../Components/fadeIn";

const PageNotFound = () => {
  return (
    <FadeWrapper>
      <div style={styles.container}>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Page Not Found</h2>
        <p style={styles.description}>
          Oops! The page you are looking for does not exist.
        </p>
        <Link to="/" style={styles.link}>
          Go Back Home
        </Link>
      </div>
    </FadeWrapper>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom right, #e66465, #9198e5)",
    color: "#fff",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "6rem",
    margin: 0,
  },
  subtitle: {
    fontSize: "2rem",
    margin: "10px 0",
  },
  description: {
    fontSize: "1.2rem",
    margin: "20px 0",
  },
  link: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#fff",
    color: "#e66465",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "background-color 0.3s, color 0.3s",
  },
};

export default PageNotFound;
