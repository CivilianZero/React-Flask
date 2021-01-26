import { FilledInput, IconButton, InputAdornment, makeStyles } from '@material-ui/core';
import { InsertEmoticonOutlined } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  chatInput: {
    marginTop: theme.spacing(3),
    minHeight: '70px',
    '& > .MuiFilledInput-input': {
      paddingTop: '10px',
    },
    borderRadius: '10px',
  },
}));

const MessageInput = ({sendMessage}) => {
  const classes = useStyles();

  return (
      <FilledInput className={classes.chatInput} fullWidth onKeyDown={sendMessage} disableUnderline
                   placeholder='Type Something...' endAdornment={
        <InputAdornment position='end'>
          <IconButton aria-label='emoji button'>
            <InsertEmoticonOutlined/>
          </IconButton>
        </InputAdornment>
      }/>
  );
};

export default MessageInput;