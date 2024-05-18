import React, { useState } from 'react';
import axios from 'axios';

const SwapExactOutput = () => {
  const [amountIn, setAmountIn] = useState('');
  const [amountOutMin, setAmountOutMin] = useState('');
  const [response, setResponse] = useState({});

  const handleSwapExactInput = async () => {
    try {
      const requestBody = {
        amountIn,
        amountOutMin
      };

      const response = await axios.post('http://localhost:3000/api/v1/swap-exact-input', requestBody);
      setResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Swap exact input data</h2>
      <label>
        Amount In:
        <input type="text" value={amountIn} onChange={(e) => setAmountIn(e.target.value)} />
      </label>
      <br />
      <label>
        Amount Out Min:
        <input type="text" value={amountOutMin} onChange={(e) => setAmountOutMin(e.target.value)} />
      </label>
      <br />
      <button onClick={handleSwapExactInput}>Swap Exact Input</button>
      <br />
      <p>Transaction success: {response.success}</p>
      <p>DAI balance after transaction: {response.balance}</p>
    </div>
  );
};

export default SwapExactOutput;
