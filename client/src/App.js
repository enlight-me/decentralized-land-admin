import React, { useState } from "react";
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import GlobalState from './context/GlobalState';
import MainAppBar from './components/MainAppBar';
import MainDrawer from './components/MainDrawer';
import MainMap from './components/MainMap';

/**
 * @notice Global App Theme
 */
const theme = createMuiTheme({
  palette: {
    type: 'light', // dark : light    
  },
});

/**
 * @dev the Main App component
 * @param {*} props 
 */
export default function App(props) {

  /**
   * @notice state variables 
   */

  /** 
   * @notice rendering the component 
   */

  return (
    <div className="App">
      <GlobalState>
        <ThemeProvider theme={theme}>

          <CssBaseline />

          <MainDrawer />

          <MainAppBar/>

          <MainMap />

        </ThemeProvider>
      </GlobalState>
    </div>
  );
}
