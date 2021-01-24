import { Typography } from '@material-ui/core';
import React, { useEffect } from 'react';

const ChatPane = ({selectedChat}) => {

  useEffect(() => {

  }, [selectedChat]);

  return (
      <Typography>{selectedChat}</Typography>
  );
};

export default ChatPane;