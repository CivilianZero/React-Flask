import { FilledInput, Grid, makeStyles, Typography } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { authFetch, getCsrfCookies } from '../services/AuthFetch';
import UserChatList from './UserChatList';

const useStyles = makeStyles((theme) => ({
  menuRoot: {
    height: '100%',
    padding: 0,
  },
  searchInput: {
    padding: theme.spacing(1),
    height: '50px',
    '& > .MuiFilledInput-input': {
      paddingTop: '10px',
    },
  },
  noMaxWidth: {
    maxWidth: 'none',
  },
}));

const ChatSidebar = ({onSelectChat}) => {
  const [userChats, setUserChats] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    let status;
    const cookies = getCsrfCookies();
    authFetch('/chats', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN-ACCESS': cookies['csrf_access_token'],
      },
    }).then(
        res => {
          if (res) {
            status = res.status;
            return res.json();
          } else throw Error('Failed to refresh token. Please log in again.');
        },
    ).then(
        res => {
          if (status < 500) setUserChats(res);
          else throw Error(res['msg']);
        },
    ).catch(
        err => {
          console.log(err);
        },
    );
  }, []);

  return (
      <Grid className={classes.menuRoot} container direction='column'>
        <Grid className={classes.noMaxWidth} item xs={1}>
          Logged In User
        </Grid>
        <Grid container item alignItems='stretch' justify='flex-start'>
          <Typography variant='h3'>Chats</Typography>
          <FilledInput className={classes.searchInput} placeholder='Search' fullWidth disableUnderline startAdornment={
            <Search/>
          }/>
          <UserChatList userChats={userChats} onSelectChat={onSelectChat}/>
        </Grid>
      </Grid>
  );
};

export default ChatSidebar;