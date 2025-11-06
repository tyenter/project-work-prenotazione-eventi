import './App.css'
import React from 'react';
import Navbar from './components/Navbar';

interface AppProps {
  children?: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  return (<>
    <Navbar />
    <div>{children}</div>
  </>);
};

export default App
