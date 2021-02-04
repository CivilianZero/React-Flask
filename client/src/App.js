import { MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MessagingPage from './pages/MessagingPage';
import SignupInPage from './pages/SignupInPage';
import { theme } from './themes/theme';

function App() {

  return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Route exact path={['/', '/signup', 'register']} component={SignupInPage}/>
          <Route exact path='/login' component={SignupInPage}/>
          <ProtectedRoute exact={true} path='/messaging' component={MessagingPage}/>
        </BrowserRouter>
      </MuiThemeProvider>
  );
}

export default App;
