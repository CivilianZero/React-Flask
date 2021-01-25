import { MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import MessagingPage from './pages/MessagingPage';
import SignupInPage from './pages/SignupInPage';
import { theme } from './themes/theme';

function App() {

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route exact path={['/', '/signup']} component={SignupInPage}/>
        <Route exact path='/login' component={SignupInPage}/>
        <Route exact path='/messaging' component={MessagingPage}/>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
