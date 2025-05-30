import React, { useState } from "react";
import { ethers } from "ethers";

export default function SendTransactionForm({ privateKey, tokens = [], onSent }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("ETH");
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const provider = new ethers.providers.JsonRpcProvider("https://web4asset.io/rpc");
  const wallet = new ethers.Wallet(privateKey, provider);

  async function handleSend(e) {
    e.preventDefault();
    setStatus(null);
    setSending(true);

    try {
      if (!ethers.utils.isAddress(to)) {
        throw new Error("Invalid recipient address");
      }
      if (Number(amount) <= 0) {
        throw new Error("Amount must be greater than zero");
      }

      let tx;

      if (tokenSymbol === "ETH") {
        // Send native token (ETH)
        tx = await wallet.sendTransaction({
          to,
          value: ethers.utils.parseEther(amount),
          gasLimit: 21000,
          gasPrice: ethers.utils.parseUnits("10", "gwei"),
        });
      } else {
        // Send ERC-20 token
        const token = tokens.find((t) => t.symbol === tokenSymbol);
        if (!token) throw new Error("Token not found");

        // ERC-20 ABI minimal for transfer
        const ERC20_ABI = ["function transfer(address to, uint amount) returns (bool)"];
        const contract = new ethers.Contract(token.contractAddress, ERC20_ABI, wallet);

        // Assume 18 decimals for simplicity, ideally fetch decimals from contract
        const amountParsed = ethers.utils.parseUnits(amount, 18);
        tx = await contract.transfer(to, amountParsed);
      }

      setStatus(`Transaction sent: ${tx.hash}`);
      setTo("");
      setAmount("");

      if (onSent) onSent(tx.hash);
    } catch (error) {
      setStatus("Error: " + error.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSend} style={{ marginTop: 20 }}>
      <h4>Send Transaction</h4>

      <select value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} disabled={sending}>
        <option value="ETH">ETH</option>
        {tokens.map((t) => (
          <option key={t.symbol} value={t.symbol}>
            {t.symbol}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ width: "300px", padding: 8, margin: "0 10px" }}
        disabled={sending}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "150px", padding: 8, marginRight: 10 }}
        step="0.0001"
        disabled={sending}
      />
      <button type="submit" disabled={sending}>
        {sending ? "Sending..." : "Send"}
      </button>
      {status && <p style={{ marginTop: 10 }}>{status}</p>}
    </form>
  );
}
