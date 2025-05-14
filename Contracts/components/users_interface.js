import React, { useState } from 'react';
import { donate, getDonation } from './services/donationService';

function DonationComponent() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleDonate = async () => {
    await donate(amount, message);
  };

  return (
    <div>
      <h1>Donation</h1>
      <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
      <button onClick={handleDonate}>Donate</button>
    </div>
  );
}

export default DonationComponent;
