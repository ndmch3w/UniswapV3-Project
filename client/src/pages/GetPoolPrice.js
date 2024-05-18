import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetPoolPrice = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/get-pool-price');
        setData(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Pool price data</h2>
      <p>Price: {data.price}</p>
      <p>Decimal Adjustment Factor: {data.decimalAdjFactor}</p>
    </div>
  );
};

export default GetPoolPrice;