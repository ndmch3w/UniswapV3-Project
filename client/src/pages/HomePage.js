import React from 'react';
import { Link, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import GetPoolPrice from './GetPoolPrice.js';
import SwapExactInput from './SwapExactInput.js';
import SwapExactOutput from './SwapExactOutput.js';

const HomePage = () => {
  return (
    <div>
      <h2>Select an API:</h2>
      <div className="button-container">
        <Link to="/get-pool-price">
          <button className="api-button">Get time-weighted pool price</button>
        </Link>
        <Link to="/swap-exact-input">
          <button className="api-button">Swap exact input</button>
        </Link>
        <Link to="/swap-exact-output">
          <button className="api-button">Swap exact output</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;