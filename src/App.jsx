import React from "react";
import WalletCard from "./components/WalletCard";
import config from "./config/config.json";

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
