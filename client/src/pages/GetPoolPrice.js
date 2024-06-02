import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';
import { RiProgress2Line } from "react-icons/ri";
import background from '../assets/bg-pic.jpg'; // Import the background image


const pools = [
  { id: 1, name: 'WBTCWETH' },
  { id: 2, name: 'USDCWETH' },
  { id: 3, name: 'LINKWETH'}
]

const time = [
  { id: 1, name: '100', display: '100s' },
  { id: 2, name: '3600', display: '1h' },
]


const GetPoolPrice = () => {
  const [data, setData] = useState(null);
  const formRef = useRef(null);
  const [selectedPool, setSelectedPool] = useState(pools[1])
  const [choicedPool, setChoicedPool] = useState(null)
  const [selectedTime, setSelectedTime] = useState(time[1])
  const [query, setQuery] = useState('')
  const [errorMessages, setErrorMessages] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const params = {
      pool: selectedPool.name,
      time: selectedTime.name,
    }

    console.log(params);
    try {
      const response = await axios.get('http://localhost:3000/api/v1/get-pool-price', { params });
      setErrorMessages(null);
      setChoicedPool(selectedPool.name);
      console.log("Error", errorMessages)
      setData(response.data);
    } catch (error) {
      setErrorMessages("Having trouble. Please try again later.")
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedPool = pools.find((pool) => pool.id === selectedId);
    setSelectedPool(selectedPool);
  };

  const handleTimeChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedTime = time.find((time) => time.id === selectedId);
    setSelectedTime(selectedTime);
  }

  const filteredPools =
    query === ''
      ? pools
      : pools.filter((pool) => {
        return pool.name.toLowerCase().includes(query.toLowerCase())
      })

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-sky-300 to-indigo-500" style={{ backgroundImage:  `url(${background})`, backgroundSize: 'cover'  }}>
      <div className='form-container-style'>
        <h2 className="mb-6 text-2xl font-bold">Pool price data</h2>
        <form
          ref={formRef}
          onSubmit={handleSubmit}>

          <p>
            <label className="block text-black font-bold m-2">Select Pool:</label>
            <select
              className="mb-4 p-2 rounded-md bg-gray-100"
              value={selectedPool.id}
              onChange={handleSelectChange}>
              {filteredPools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.name}
                </option>
              ))}
            </select>

            <select
              className="mb-4 p-2 rounded-md bg-gray-100 m-2"
              value={selectedTime.id}
              onChange={handleTimeChange}>
              {time.map((timeOption) => (
                <option key={timeOption.id} value={timeOption.id}>
                  {timeOption.display}
                </option>
              ))}
            </select>
          </p>

          <p className='flex flex-col justify-center items-center mb-2'>
            <button
              className='"w-20 h-10 px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-150 ease-in-out'
              type='submit'
              style={{ width: "200px" }}>
              {loading ? <div className="flex justify-center">
                <RiProgress2Line size={25} className="animate-spin h-4 w-4 mr-2" />
              </div> : "Get Pool Price"}
            </button>
          </p>
        </form>

        {errorMessages != null && (
          <p className="text-red-500 mt-3 inline-flex items-center text-sm text-center">
            <FaExclamationCircle className="mr-1" />
            {errorMessages}
          </p>
        )}
        {data != undefined && errorMessages == null && (
          <div>
            <p className="mb-4">
              Price:{" "}
              <span className="text-cyan-500 font-bold">{data.price}</span>
            </p>
            <p className="mb-4">
              Decimal Adjustment Factor:{" "}
              <span className="text-cyan-500 font-bold">{data.decimalAdjFactor}</span>
            </p>
            <p className="mb-4">
              <p>
                Price in comparison:{" "}
                <span className='font-bold'>{choicedPool === 'WBTCWETH' ? 'WBTC/WETH' : 
                   choicedPool === 'USDCWETH' ? 'USDC/WETH' : 
                   'LINK/WETH'}</span>
              </p>
              <span className="text-cyan-500 font-bold">{data.priceInComparison}</span>
            </p>
          </div>
        )}

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

export default GetPoolPrice;
