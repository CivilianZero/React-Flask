import { Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { fetchRetry } from '../services/FetchRetry';

const useStyles = makeStyles((theme) => ({
  messageContainer: {
    height: '100%',
    position: 'absolute',
    bottom: '0px',
    overflowY: 'auto',
    paddingTop: theme.spacing(2),
  },
  messageRow: {
    margin: theme.spacing(1),
    '& small': {
      color: '#BECCE2',
    },
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
    background: '#F4F6FA',
  },
  smallRight: {
    textAlign: 'right',
  },
}));

const ChatPane = ({selectedChat, currentUser, newMessage}) => {
  const [messages, setMessages] = useState([]);
  const messageRef = useRef(null);
  const classes = useStyles();

  const parseDate = (string) => {
    let t = string.split(/[- :]/);
    let d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
    return `${d.getHours()}:${d.getMinutes()}`;
  };

  const updateMessages = () => {
    let status;
    fetchRetry(`/messages/${selectedChat}`, {}).then(
        res => {
          status = res.status;
          return res.json();
        },
    ).then(
        res => {
          if (status < 400) {
            setMessages(res);
            messageRef.current['scrollIntoView']();
          } else throw Error(res['msg']);
        },
    ).catch(
        err => console.log(err),
    );
  };

  useEffect(() => {
    if (selectedChat) {
      updateMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (newMessage.text && newMessage.text.length > 0) {
      setMessages([...messages, newMessage]);
      setTimeout(() => messageRef.current['scrollIntoView']());
      let status;
      fetchRetry('/message', {
        method: 'POST', body: JSON.stringify({
          text: newMessage.text,
          timestamp: newMessage.timestamp,
          conversation_id: newMessage.conversation_id,
        }),
      }).then(
          res => {
            status = res.status;
            return res.json();
          },
      ).then(
          res => {
            if (status < 400) {
              console.log(res);
              setMessages([...messages, res]);
            } else throw Error(res['msg']);
          },
      ).catch(
          err => {
            // TODO: add snackbar maybe to show if message didn't send?
            console.log(err);
          },
      );
    }
  }, [newMessage]);

  return (
      <Grid container className={classes.messageContainer}>
        {messages.map((message) =>
            (<Grid key={message.id} container item className={classes.messageRow}
                   direction={message['user_id'] === currentUser['id'] ? 'row-reverse' : 'row'}>
              <Grid item sm={5} xs={7}>
                <div className={message['user_id'] === currentUser['id'] ? classes.smallRight : null}>
                  <small>{message['sender']} </small><small>{`${parseDate(message['timestamp'])}`}</small>
                </div>
                <Paper ref={messageRef} elevation={0}
                       className={`${classes.messageBubble}  ${message['user_id'] === currentUser['id'] ? classes.yourMessage : classes.theirMessage}`}>
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