import React, { useState } from 'react';
import axios from 'axios';
import SwapButton from '../components/SwapButton';
import { FaExclamationCircle } from 'react-icons/fa';
import { RiProgress2Line } from "react-icons/ri";
import { Link } from 'react-router-dom';
import background from '../assets/bg-pic.jpg'; // Import the background image



const SwapExactInput = () => {
  const [amountIn, setAmountIn] = useState('');
  const [amountOutMin, setAmountOutMin] = useState('');
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSwapExactInput = async () => {
    try {
      setLoading(true); // Set loading state to true
      const requestBody = {
        amountIn,
        amountOutMin,
      };

      const response = await axios.post('http://localhost:3000/api/v1/swap-exact-input', requestBody);
      setResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
      setResponse({ success: false, error: error.message });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-sky-300 to-indigo-500" style={{ backgroundImage:  `url(${background})`, backgroundSize: 'cover'  }}>
      <div className='form-container-style'>
        <h2 className="mb-6 text-2xl font-bold">Swap exact input data</h2>
        <label className="mb-4 font-bold">
          Amount In:
          <input
            type="text"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            className="block w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </label>
        <label className="mb-4 font-bold">
          Amount Out Min:
          <input
            type="text"
            value={amountOutMin}
            onChange={(e) => setAmountOutMin(e.target.value)}
            className="block w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-5"
          />
          <SwapButton onClick={handleSwapExactInput}>Swap Exact Input</SwapButton>
        </label>

        {loading && <p><RiProgress2Line size={30} className="animate-spin h-4 w-4"></RiProgress2Line></p>} {/* Render loading indicator if loading state is true */}

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
            LINK balance after transaction:{" "}
            {response.balance !== undefined ? (
              <span className="text-cyan-500 font-bold">
                {response.balance}
              </span>
            ) : null}
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

export default SwapExactInput;
