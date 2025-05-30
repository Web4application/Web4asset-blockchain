import React, { useState, useEffect } from "react";
import WalletCard from "./components/WalletCard";
import config from "./config/config.json";
import CryptoJS from "crypto-js";
import { ethers } from "ethers";

function App() {
  const [passphrase, setPassphrase] = useState("");
  const [inputPassphrase, setInputPassphrase] = useState("");
  const [locked, setLocked] = useState(true);
  const [decrypting, setDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState(null);

  // MetaMask state
  const [metaMaskAddress, setMetaMaskAddress] = useState(null);
  const [metaMaskBalance, setMetaMaskBalance] = useState(null);

  useEffect(() => {
    const clearPassphrase = () => {
      setPassphrase("");
      setLocked(true);
      setMetaMaskAddress(null);
      setMetaMaskBalance(null);
    };
    window.addEventListener("beforeunload", clearPassphrase);
    return () => window.removeEventListener("beforeunload", clearPassphrase);
  }, []);

  async function handlePassphraseSubmit(e) {
    e.preventDefault();
    setDecrypting(true);
    setDecryptError(null);

    try {
      const testWallet = config.wallets[0];
      const bytes = CryptoJS.AES.decrypt(testWallet.encryptedPrivateKey, inputPassphrase);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) throw new Error("Invalid passphrase");

      setPassphrase(inputPassphrase);
      setLocked(false);
      setInputPassphrase("");
    } catch (err) {
      setDecryptError("Invalid passphrase");
    } finally {
      setDecrypting(false);
    }
  }

  async function connectMetaMask() {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }
    try {
      const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setMetaMaskAddress(account);
      setLocked(false);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balanceBigNumber = await provider.getBalance(account);
      const balanceString = ethers.utils.formatEther(balanceBigNumber);
      setMetaMaskBalance(balanceString + " ETH");
    } catch (err) {
      alert("Failed to connect MetaMask");
    }
  }

  function handleLogout() {
    setPassphrase("");
    setLocked(true);
    setMetaMaskAddress(null);
    setMetaMaskBalance(null);
  }

  if (locked && !metaMaskAddress) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Unlock Wallets</h1>
        <form onSubmit={handlePassphraseSubmit} style={{ marginBottom: 20 }}>
          <input
            type="password"
            value={inputPassphrase}
            onChange={(e) => setInputPassphrase(e.target.value)}
            placeholder="Passphrase"
            style={{ width: 300, padding: 8 }}
            disabled={decrypting}
          />
          <button type="submit" disabled={decrypting} style={{ marginLeft: 10, padding: 8 }}>
            {decrypting ? "Unlocking..." : "Unlock Wallets"}
          </button>
        </form>

        {decryptError && <p style={{ color: "red" }}>{decryptError}</p>}

        <hr style={{ margin: "20px 0" }} />
        <button onClick={connectMetaMask} style={{ padding: "10px 20px" }}>
          Connect with MetaMask
        </button>
      </div>
    );
  }

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Web4Asset Wallet Manager</h1>

      {metaMaskAddress ? (
        <div style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
          <h3>MetaMask Account</h3>
          <p>Address: {metaMaskAddress}</p>
          <p>Balance: {metaMaskBalance || "Loading..."}</p>
        </div>
      ) : (
        config.wallets.map((wallet, index) => (
          <WalletCard key={index} wallet={wallet} passphrase={passphrase} locked={locked} />
        ))
      )}

      <button onClick={handleLogout} style={{ marginTop: 30, padding: "10px 20px" }}>
        Lock Wallets
      </button>
    </div>
  );
}

function App() {
  // TODO: Replace with a secure passphrase input method
  const passphrase = "yourpassword";

  return (
    <div className="App" style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Web4Asset Wallet Manager</h1>
      {config.wallets.map((wallet, idx) => (
        <WalletCard key={idx} wallet={wallet} passphrase={passphrase} />
      ))}
    </div>
  );
}

export default App;
