import { Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { authFetch } from '../services/AuthFetch';

const useStyles = makeStyles((theme) => ({
  messageBubble: {
    color: '#D8D8D8',
    padding: theme.spacing(2),
  },
  yourMessage: {
    borderRadius: '10px 0px 10px 10px',
    background: '#F4F6FA',
  },
  theirMessage: {
    borderRadius: '0px 10px 10px 10px',
    background: 'linear-gradient(to right, #3A8DFF, #6CC1FF)',
  },
}));

const ChatPane = ({selectedChat, currentUser}) => {
  const [messages, setMessages] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    let status;
    if (selectedChat) {
      authFetch(`/messages/${selectedChat}`, {}).then(
          res => {
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
      <Grid container>
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