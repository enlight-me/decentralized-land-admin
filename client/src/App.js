import React from "react";
import './App.css';
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import GlobalState from './context/GlobalState';
import MainAppBar from './components/MainAppBar';
import MainDrawer from './components/MainDrawer';
import MainMap from './components/MainMap';

import About from './pages/About';
import Dashboard from './pages/Dashboard';

/**
 * @notice Global App Theme
 */
const theme = createMuiTheme({
  palette: {
    type: 'dark', // dark : light    
  },
  typography: {
    fontFamily: 'Lato, Helvetica, sans-serif',
    fontWeight: 700
  }
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
          <Router>
            <CssBaseline />
            
            <Switch>

              <Route path="/about">
                <About />
              </Route>

              <Route path="/dashboard">
                <Dashboard />
              </Route>
              
              <Route path="/">
                <MainDrawer />
                <MainAppBar />
                <MainMap />
              </Route>

            </Switch>

          </Router>
        </ThemeProvider>
      </GlobalState>
    </div>
  );
}
