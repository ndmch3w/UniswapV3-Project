import React, { useState } from 'react';
import axios from 'axios';

const SwapExactOutput = () => {
  const [amountOut, setAmountOut] = useState('');
  const [amountInMax, setAmountInMax] = useState('');
  const [response, setResponse] = useState({});

  const handleSwapExactOutput = async () => {
    try {
      const requestBody = {
        amountOut,
        amountInMax
      };

      const response = await axios.post('http://localhost:3000/api/v1/swap-exact-output', requestBody);
      setResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Swap exact output data</h2>
      <label>
        Amount Out:
        <input type="text" value={amountOut} onChange={(e) => setAmountOut(e.target.value)} />
      </label>
      <br />
      <label>
        Amount In Max:
        <input type="text" value={amountInMax} onChange={(e) => setAmountInMax(e.target.value)} />
      </label>
      <br />
      <button onClick={handleSwapExactOutput}>Swap Exact Output</button>
      <br />
      <p>Transaction success: {response.success}</p>
      <p>DAI balance after transaction: {response.balance}</p>
    </div>
  );
};

export default SwapExactOutput;
