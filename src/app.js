import React from "react";
import WalletCard from "./components/WalletCard";
import config from "./config/config.json";

function App() {
  const passphrase = "yourpassword";  // Replace with secure method to retrieve passphrase

  return (
    <div className="App">
      <h1>Web4Asset Wallet Manager</h1>
      {config.wallets.map((wallet, index) => (
        <WalletCard key={index} wallet={wallet} passphrase={passphrase} />
      ))}
    </div>
  );
}

export default App;
