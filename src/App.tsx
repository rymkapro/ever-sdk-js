import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { TonClient } from '@eversdk/core';

const client = new TonClient();

function App() {

  useEffect(() => {
    client.utils.compress_zstd({uncompressed: ''}).then((r) => {
      console.log('Compressed:', r.compressed);
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
