import { CircularProgress, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { fetchRetry } from '../services/FetchRetry';

const useStyles = makeStyles(() => ({
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-50px',
    marginLeft: '-50px',
  },
}));

const ProtectedRoute = ({component: Component, ...rest}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const classes = useStyles();

  useEffect(() => {
    fetchRetry('/auth', {}).then(
        res => {
          if (res.status < 400) {
            setIsAuthenticated(true);
          } else setIsAuthenticated(false);
          setIsLoading(false);
        },
    );
  }, []);

  if (isLoading) return <CircularProgress className={classes.loading}/>;

  if (isAuthenticated) return <Route component={Component} {...rest}/>;
  else return <Redirect to='/login'/>;
};

export default ProtectedRoute;