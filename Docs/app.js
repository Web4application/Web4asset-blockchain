import { useState } from "react";
import { ethers } from "ethers";

function App() {
    const [balance, setBalance] = useState(0);

    async function connectWallet() {
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            setBalance(ethers.formatEther(balance));
        } else {
            alert("Please install MetaMask");
        }
    }

    return (
        <div>
            <h1>Web4Asset Dashboard</h1>
            <button onClick={connectWallet}>Connect Wallet</button>
            <p>Balance: {balance} W4T</p>
        </div>
    );
}

export default App;
