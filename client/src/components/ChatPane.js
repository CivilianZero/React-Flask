import { Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { authFetch } from '../services/AuthFetch';

const ChatPane = ({selectedChat}) => {
  const [messages, setMessages] = useState([]);

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
  const messageBubbles = messages.map((message) =>
      <Typography key={message.id}>{message.text}</Typography>);

  return (
      <Grid container>
        {messageBubbles}
      </Grid>
  );
};

export default ChatPane;