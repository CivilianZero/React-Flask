import { Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { fetchRetry } from '../services/FetchRetry';

const useStyles = makeStyles((theme) => ({
  messageContainer: {
    height: '100%',
    overflowY: 'scroll',
    paddingTop: theme.spacing(2),
  },
  messageBubble: {
    display: 'inline-block',
    fontWeight: '600',
    padding: theme.spacing(2),
  },
  yourMessage: {
    float: 'right',
    color: 'white',
    borderRadius: '10px 0px 10px 10px',
    background: 'linear-gradient(to right, #3A8DFF, #6CC1FF)',
  },
  theirMessage: {
    color: 'grey',
    borderRadius: '0px 10px 10px 10px',
    background: '#e7e9ee',
  },
}));

const ChatPane = ({selectedChat, currentUser}) => {
  const [messages, setMessages] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    let status;
    if (selectedChat) {
      fetchRetry(`/messages/${selectedChat}`, {}).then(
          res => {
            console.log(res);
            status = res.status;
            return res.json();
          },
      ).then(
          res => {
            if (status < 400) setMessages(res);
            else throw Error(res['msg']);
          },
      ).catch(
          err => console.log(err),
      );
    }
  }, [selectedChat]);

  return (
      <Grid container className={classes.messageContainer}>
        {messages.map((message) =>
            (<Grid key={message.id} container item
                   direction={message['sender_id'] === currentUser['id'] ? 'row-reverse' : 'row'}>
              <Grid item sm={5} xs={7}>
                <Paper elevation={0}
                       className={`${classes.messageBubble}  ${message['sender_id'] === currentUser['id'] ? classes.yourMessage : classes.theirMessage}`}>
                  {message['text']}
                </Paper>
              </Grid>
              <Grid item xs sm> </Grid>
            </Grid>),
        )}
      </Grid>
  );
};

export default ChatPane;