import './App.css'
import React from 'react';

interface AppProps {
  children?: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default App
