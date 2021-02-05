import { Badge, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { io } from 'socket.io-client';
import ChatPane from '../components/ChatPane';
import ChatSidebar from '../components/ChatSidebar';
import MessageInput from '../components/MessageInput';
import { fetchRetry } from '../services/FetchRetry';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    padding: theme.spacing(3),
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
    height: '65px',
    '& svg': {
      color: '#95A7C4',
    },
    '& h5': {
      display: 'inline',
    },
  },
  badge: {
    margin: theme.spacing(2),
    '& .MuiBadge-colorError': {
      backgroundColor: '#D0DAE9',
    },
  },
  relative: {
    position: 'relative',
  },
  noMaxWidth: {
    maxWidth: 'none',
  },
}));

const MessagingPage = () => {
  const [{selectedChatId, selectedChatUsername}, setSelectedChat] = useState({});
  const [currentUser, setCurrentUser] = useState({username: '', id: '', email: ''});
  const [newMessage, setNewMessage] = useState({});
  const [messageSocket, setMessageSocket] = useState(null);
  const [userSocket, setUserSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [messageInputValue, setMessageInputValue] = useState('');
  const classes = useStyles();
  const history = useHistory();


  useEffect(() => {
    let uSocket;
    let mSocket;
    let status;
    fetchRetry('/user', {}).then(
        res => {
          status = res.status;
          return res.json();
        },
    ).then(
        res => {
          if (status < 400) {
            mSocket = io('/message');
            setMessageSocket(mSocket);
            uSocket = io('/user');
            setUserSocket(uSocket);
            setCurrentUser(res);
          } else throw Error(res['msg']);
        },
    ).catch(
        err => {
          if (status === 401) history.push('/login');
          console.log(err);
        },
    );
    return () => {
      if (uSocket && mSocket) {
        uSocket.disconnect();
        mSocket.disconnect();
      }
    };
  }, []);


  useEffect(() => {
    if (!messageSocket || !userSocket) return;

    userSocket.on('get_users', (data) => {
      setOnlineUsers(data);
    });
    messageSocket.on('receive_message', (data) => {
      setNewMessage(data);
    });
  }, [messageSocket, userSocket]);

  const sendMessage = (event) => {
    event.preventDefault();
    const newMessageObj = {
      text: messageInputValue,
      timestamp: new Date().toISOString(),
      conversation_id: selectedChatId,
    };
    messageSocket.emit('send_chat', newMessageObj);
    setMessageInputValue('');
  };

  return (
      <Grid container className={classes.root} spacing={3}>
        <Grid item sm={3}>
          <ChatSidebar onSelectChat={setSelectedChat} currentUser={currentUser} onlineUsers={onlineUsers}/>
        </Grid>
        <Grid container item sm direction='column' alignItems='stretch'>
          <Grid className={classes.noMaxWidth} item xs={1}>
            <Paper className={classes.statusBar}>
              <Grid container alignItems='center'>
                <Grid item xs>
                  <Typography variant='h5'>{selectedChatUsername}</Typography>
                  {selectedChatUsername ?
                      <span><Badge className={classes.badge}
                                   color={Object.prototype.hasOwnProperty.call(onlineUsers, selectedChatUsername) ? 'secondary' : 'error'}
                                   variant='dot'/>
                        <small>{Object.prototype.hasOwnProperty.call(onlineUsers, selectedChatUsername) ? 'Online' : 'Offline'}</small></span> :
                      <span/>}
                </Grid>
                <Grid container item xs={1} alignItems='center'>
                  <MoreHoriz/>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid container item xs direction='column' alignItems='stretch'>
            <Grid className={`${classes.noMaxWidth} ${classes.relative}`} item xs={10}>
              <ChatPane selectedChat={selectedChatId} currentUser={currentUser} newMessage={newMessage}/>
            </Grid>
            <Grid className={classes.relative} container item xs>
              <MessageInput sendMessage={sendMessage} messageInputValue={messageInputValue}
                            setMessageInputValue={setMessageInputValue}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  );
};

export default withRouter(MessagingPage);