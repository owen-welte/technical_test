import { ToastContainer } from "react-toastify";
import React from 'react';
import Home from './pages/Home.js'
import './App.css';
import "react-toastify/dist/ReactToastify.css";
import 'bulma/css/bulma.min.css';


function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Home />
    </div>
  );
}

export default App;
