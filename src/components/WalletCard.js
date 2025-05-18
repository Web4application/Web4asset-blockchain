import React, { useState } from "react";
import { getBalance } from "../services/blockchain";
import { decryptPrivateKey } from "../services/encryption";
import config from "../config/config.json";

const WalletCard = ({ wallet, passphrase }) => {
  const [balance, setBalance] = useState("Loading...");
  const [privateKey, setPrivateKey] = useState(null);

  const loadBalance = async () => {
    const walletBalance = await getBalance(wallet.address);
    setBalance(walletBalance);
  };

  const handleDecrypt = () => {
    const decryptedKey = decryptPrivateKey(wallet.encryptedPrivateKey, passphrase);
    setPrivateKey(decryptedKey);
  };

  return (
    <div className="wallet-card">
      <h3>Address: {wallet.address}</h3>
      <p>Balance: {balance} W4T</p>
      <button onClick={loadBalance}>Load Balance</button>
      <button onClick={handleDecrypt}>Decrypt Private Key</button>
      {privateKey && <p>Private Key: {privateKey}</p>}
    </div>
  );
};

export default WalletCard;
