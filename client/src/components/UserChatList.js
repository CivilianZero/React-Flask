import { Badge, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import React from 'react';

const useStyle = makeStyles(() => ({
  userList: {
    width: '100%',
  },
  userItem: {
    height: '80px',
  },
  badge: {
    '& .MuiBadge-colorError': {
      backgroundColor: '#D0DAE9',
    },
  },
}));

const UserChatList = ({userChats, onSelectChat, onlineUsers}) => {
  const classes = useStyle();

  return (
      <List className={classes.userList}>
        {userChats.map((chat) =>
            <ListItem key={chat['conversation_id']} className={classes.userItem} button
                      onClick={() => onSelectChat({
                        selectedChatUsername: chat['username'],
                        selectedChatId: chat['conversation_id'],
                      })}>
              <ListItemIcon>
                <Person/>
                <Badge
                    className={classes.badge}
                    color={Object.prototype.hasOwnProperty.call(onlineUsers, chat['username']) ? 'secondary' : 'error'}
                    variant='dot'
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} overlap='circle'/>
              </ListItemIcon>
              <ListItemText
                  primary={chat['username']}
              />
            </ListItem>,
        )}
      </List>
  );
};

export default UserChatList;