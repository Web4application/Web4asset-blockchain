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

  // Clear passphrase on page unload
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

  // Handle passphrase submission and decryption
  async function handlePassphraseSubmit(e) {
    e.preventDefault();
    setDecrypting(true);
    setDecryptError(null);

    try {
      const testWallet = config.wallets[0]; // Assume wallets is an array
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

  // Connect MetaMask
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

  // Handle logout (lock wallet)
  function handleLogout() {
    setPassphrase("");
    setLocked(true);
    setMetaMaskAddress(null);
    setMetaMaskBalance(null);
  }

  // If the wallet is locked and MetaMask is not connected, show the unlock page
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

  // Main wallet manager page
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

export default App;
