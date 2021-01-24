import { List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import React from 'react';

const useStyle = makeStyles((theme) => ({
  userList: {
    width: '100%',
  },
  userItem: {
    height: '80px',
  },
}));

const UserChatList = ({userChats, onSelectChat}) => {
  const classes = useStyle();

  const chatList = userChats.map((user) =>
      <ListItem key={user['conversation_id']} className={classes.userItem} button
                onClick={() => onSelectChat(user['conversation_id'])}>
        <ListItemIcon>
          <Person/>
        </ListItemIcon>
        <ListItemText
            primary={user['username']}
        />
      </ListItem>,
  );
  return (
      <List className={classes.userList}>{chatList}</List>
  );
};

export default UserChatList;