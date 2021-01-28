import { FilledInput, Grid, makeStyles, Typography } from '@material-ui/core';
import { MoreHoriz, Search } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { fetchRetry } from '../services/FetchRetry';
import UserChatList from './UserChatList';

const useStyles = makeStyles((theme) => ({
  menuRoot: {
    height: '100%',
    padding: 0,
  },
  userStatus: {
    height: '89px',
    '& svg': {
      color: '#95A7C4',
    },
  },
  sideHeader: {
    padding: theme.spacing(2),
  },
  searchInput: {
    color: '#95A7C4',
    backgroundColor: '#E9EEF9 !important',
    padding: theme.spacing(1),
    height: '50px',
    '& > .MuiFilledInput-input': {
      paddingTop: '10px',
    },
    borderRadius: '10px',
  },
  noMaxWidth: {
    maxWidth: 'none',
  },
}));

const ChatSidebar = ({onSelectChat, currentUser}) => {
  const [userChats, setUserChats] = useState([]);
  const [userList, setUserList] = useState([]);

  const classes = useStyles();

  const loadChats = () => {
    let status;
    fetchRetry('/chats', {}).then(
        res => {
          status = res.status;
          return res.json();
        },
    ).then(
        res => {
          if (status < 400) setUserChats(res);
          else throw Error(res['msg']);
        },
    ).catch(
        err => console.log(err),
    );
  };

  useEffect(() => {
    loadChats();
    let status;
    fetchRetry('/users', {}).then(
        res => {
          status = res.status;
          return res.json();
        },
    ).then(
        res => {
          if (status < 400) setUserList(res);
          else throw Error(res['msg']);
        },
    ).catch(
        err => console.log(err),
    );
  }, []);

  const createChat = (event) => {
    let status;
    console.log(event.target.value);
    if (event.key === 'Enter') {
      fetchRetry('/chat', {
        method: 'POST',
        body: JSON.stringify({
          target_username: event.target.value,
        }),
      }).then(
          res => {
            status = res.status;
            return res.json();
          },
      ).then(
          res => {
            console.log(res);
            if (status < 400) setUserChats([...userChats, res]);
            else throw Error(res['msg']);
          },
      ).catch(
          err => console.log(err),
      );
    }
  };

  return (
      <Grid className={classes.menuRoot} container direction='column'>
        <Grid className={`${classes.noMaxWidth} ${classes.userStatus}`} container item xs={2} alignItems='center'>
          <Grid item xs>
            <Typography variant='h5'>{currentUser['username']}</Typography>
          </Grid>
          <Grid item xs={1} container alignItems='center'>
            <MoreHoriz/>
          </Grid>
        </Grid>
        <Grid container item alignItems='stretch' justify='flex-start'>
          <Typography className={classes.sideHeader} variant='h5'>Chats</Typography>
          <Autocomplete onKeyDown={createChat} clearOnBlur={true} autoComplete={true} autoHighlight={true} freeSolo
                        clearOnEscape={true}
                        renderInput={(params) => (
                            <FilledInput inputRef={params.InputProps.ref} inputProps={{...params.inputProps}}
                                         className={classes.searchInput} placeholder='Search' fullWidth disableUnderline
                                         startAdornment={
                                           <Search/>
                                         }
                            />)} options={userList.map(user => user['username'])}/>
          <UserChatList userChats={userChats} onSelectChat={onSelectChat}/>
        </Grid>
      </Grid>
  );
};

export default ChatSidebar;