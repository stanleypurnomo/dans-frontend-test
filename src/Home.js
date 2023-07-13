import './App.css';
import HeaderLoginGoogle from './components/HeaderLoginGoogle';
import SearchJobs from './components/SearchJobs';
import { useState, useEffect, useRef } from 'react';

function Home() { 

  return (
    <div className="App">
      <HeaderLoginGoogle/>
      <SearchJobs/>
    </div>
  );
}

export default Home;
