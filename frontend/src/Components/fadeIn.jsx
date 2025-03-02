import React from "react";
import { motion } from "framer-motion";

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
// console.log("FadeWrapper");

const FadeWrapper = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeVariants}
      transition={{ duration: 0.5 }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default FadeWrapper;
