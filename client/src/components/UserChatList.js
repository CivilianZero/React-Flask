import { Badge, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';

const useStyle = makeStyles((theme) => ({
  userList: {
    width: '100%',
  },
  userItem: {
    height: '80px',
  },
}));

const UserChatList = ({userChats, onSelectChat, onlineUsers}) => {
  const [userChatList, setUserChatList] = useState(userChats);
  const classes = useStyle();

  useEffect(() => {
    const chatList = userChats;
    chatList.forEach(chat => {
      if (Object.prototype.hasOwnProperty.call(onlineUsers, chat['username'])) {
        chat['online'] = true;
      }
    });
    setUserChatList(chatList);
  }, [onlineUsers, userChatList]);

  return (
      <List className={classes.userList}>
        {userChatList.map((chat) =>
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
        )}
      </List>
  );
};

export default UserChatList;