import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import React from 'react';

const UserChatList = ({userChats}) => {
  const chatItems = userChats.map((user) =>
      <ListItem key={user['conversation_id']}>
        <ListItemIcon>
          <Person/>
        </ListItemIcon>
        <ListItemText
            primary={user.username}
        />
      </ListItem>,
  );
  return (
      <List>{chatItems}</List>
  );
};

export default UserChatList;