import React from 'react';
import { useSelector } from 'react-redux';
import createTheme from '@mui/material/styles/createTheme';
import { ThemeProvider } from '@mui/material';
import CssBaseline from "@mui/material/CssBaseline/CssBaseline"

import './App.css';
import MainNav from '../../navigate/MainNav';
import Navbar from "../../navigate/Navbar"
import { createThemeOptions } from '../../consts';

function App() {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const [mode, setMode] = React.useState(window.localStorage.getItem('themeColor') || 'light');
  createThemeOptions.palette.mode = mode;
  const theme = createTheme(createThemeOptions);
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
      <div className="App">
        <Navbar isAuth={isAuth}/>
        {isLoading ? <div className="spinner" /> : <MainNav isAuth={isAuth} />}
      </div>
    </ThemeProvider>
  );
}

export default App;
