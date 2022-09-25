import React from 'react';
import { useSelector } from 'react-redux';

// TODO: create own Route component.
import Header from '../Header/Header';
import './App.css';
import MainNav from "../../navigate/MainNav"

function App() {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const isLoading = useSelector((state) => state.auth.isLoading);

  return (
    <div className="App">
      <Header isAuth={isAuth} />
      {isLoading ? <div className="spinner" /> : <MainNav isAuth={isAuth} />}
    </div>
  );
}

export default App;
