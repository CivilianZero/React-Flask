import { Badge, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
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

  const chatList = userChats.map((chat) =>
      <ListItem key={chat['conversation_id']} className={classes.userItem} button
                onClick={() => onSelectChat({
                  selectedChatUsername: chat['username'],
                  selectedChatId: chat['conversation_id'],
                })}>
        <ListItemIcon>
          <Person/>
          <Badge color={chat['online'] ? 'secondary' : 'error'} variant='dot'
                 anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} overlap='circle'/>
        </ListItemIcon>
        <ListItemText
            primary={chat['username']}
        />
      </ListItem>,
  );
  return (
      <List className={classes.userList}>{chatList}</List>
  );
};

export default UserChatList;