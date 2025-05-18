import React, { useState, useEffect } from "react";
import { getTokenBalance } from "../services/blockchain";
import config from "../config/config.json";

const WalletCard = ({ wallet }) => {
  const [balance, setBalance] = useState("Loading...");

  useEffect(() => {
    async function fetchBalance() {
      const contractAddress = config.tokenContract;
      const walletBalance = await getTokenBalance(wallet.address, contractAddress);
      setBalance(walletBalance);
    }
    fetchBalance();
  }, [wallet.address]);

  return (
    <div className="wallet-card">
      <h3>Address: {wallet.address}</h3>
      <p>Balance: {balance} W4T</p>
    </div>
  );
};

export default WalletCard;
