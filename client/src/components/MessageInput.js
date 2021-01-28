import { FilledInput, IconButton, InputAdornment, makeStyles } from '@material-ui/core';
import { InsertEmoticonOutlined } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  chatInput: {
    position: 'absolute',
    color: '#95A7C4',
    backgroundColor: '#E9EEF9 !important',
    marginTop: theme.spacing(3),
    height: '70px',
    '& > .MuiFilledInput-input': {
      paddingTop: '10px',
    },
    '& svg': {
      color: '#95A7C4',
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