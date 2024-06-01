// src/pages/HomePage.js
import React from 'react';
import Button from '../components/Button'; // Import the Button component
import background from '../assets/bg-pic.jpg'; // Import the background image

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundImage:  `url(${background})`, backgroundSize: 'cover'  }}>
      <div className='form-container-style'>
        <h2 className="mb-6 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Select an API:</h2>
        <div className="flex flex-col gap-4 w-64 button-container"> {/* Set a fixed width for buttons container */}
          <Button to="/get-pool-price">Get time-weighted pool price</Button>
          <Button to="/swap-exact-input">Swap exact input</Button>
          <Button to="/swap-exact-output">Swap exact output</Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
