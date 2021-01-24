import { FilledInput, Grid, makeStyles, Typography } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
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
  const [cookies] = useCookies(['access_token', 'refresh_token']);

  const classes = useStyles();

  useEffect(() => {
    let status;
    fetch(`${process.env.REACT_APP_BASE_URL}/chats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies['access_token']}`,
      },
    }).then(
        res => {
          status = res.status;
          return res.json();

        },
    ).then(
        res => {
          if (status < 500) setUserChats(res);
          else throw Error(res.message);
        },
    ).catch(
        err => {
          console.log(err.message);
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