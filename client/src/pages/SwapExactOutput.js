import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SwapButton from '../components/SwapButton';
import background from '../assets/bg-pic.jpg'; // Import the background image


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
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-sky-300 to-indigo-500" style={{ backgroundImage:  `url(${background})`, backgroundSize: 'cover'  }}>
      <div className='form-container-style'>
        <h2 className="mb-6 text-2xl font-bold">Swap exact output data</h2>
        <label className="mb-4 font-bold">
          Amount Out:
          <input type="text" value={amountOut} onChange={(e) => setAmountOut(e.target.value)}
            className="block w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </label>
        <label className="mb-4 font-bold">
          Amount In Max:
          <input type="text" value={amountInMax} onChange={(e) => setAmountInMax(e.target.value)}
            className="block w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-5"
          />
          <SwapButton onClick={handleSwapExactOutput}>Swap Exact Output</SwapButton>
        </label>

        <div className="mt-6 w-full px-4 py-2 rounded-md">
          <p>
            Transaction success:{" "}
            {response.success !== undefined ? (
              <span className={`text-${response.success ? 'green' : 'red'}-500 font-bold`}>
                {response.success ? 'Yes' : 'No'}
              </span>
            ) : null}
          </p>
          <p>
            LINK balance after transaction:
            {response.balance}
          </p>
          <p>
            Transaction Hash:{" "}
            {response.transactionHash ? (
              <span className="text-cyan-500 font-bold">
                {response.transactionHash}
              </span>
            ) : null}
          </p>
          {response.error && (
            <p className="text-red-500 font-bold">
              Error: {response.error}
            </p>
          )}
        </div>

        <p className="w-full flex flex-col gap-4">
          <Link
            to="/"
            className="mt-6 flex justify-end font-bold text-gray-500 hover:text-gray-800 hover:underline">
              Back to HomePage
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SwapExactOutput;
