import React from "react";
import { requestTokens } from "../services/blockchain";

const FaucetRequest = () => {
  const handleRequest = async () => {
    try {
      await requestTokens();
      alert("Tokens requested successfully!");
    } catch (error) {
      console.error("Error requesting tokens:", error.message);
    }
  };

  return <button onClick={handleRequest}>Request Tokens</button>;
};

export default FaucetRequest;
