import React, { useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import axios from 'axios';
import Web3 from 'web3';

function App() {
  const [account, setAccount] = useState('');
  const [marketData, setMarketData] = useState([]);
  const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'));

  const connectMetaMask = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const getBinanceMarketData = async () => {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/price');
      setMarketData(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  return (
    <div>
      <h1>Web4asset</h1>
      <button onClick={connectMetaMask}>Connect MetaMask</button>
      <p>Connected Account: {account}</p>
      <button onClick={getBinanceMarketData}>Get Market Data</button>
      <ul>
        {marketData.map((data, index) => (
          <li key={index}>{data.symbol}: {data.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
