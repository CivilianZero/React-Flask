import {
  FilledInput,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Person, Search } from '@material-ui/icons';
import React, { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  menuRoot: {
    height: '100%',
    padding: 0,
  },
  searchInput: {
    padding: theme.spacing(1),
    height: '50px',
    '& > .MuiFilledInput-input': {
      paddingTop: '10px',
    },
  },
}));

const MessageMenu = () => {
  const classes = useStyles();

  useEffect(() => {
    // fetch()
  }, []);

  return (
      <Grid className={classes.menuRoot} container direction='column'>
        <Grid className={classes.noMaxWidth} item xs={1}>
          Logged In User
        </Grid>
        <Grid container item alignItems='stretch' justify='flex-start'>
          <Typography variant='h3'>Chats</Typography>
          <FilledInput className={classes.searchInput} placeholder='Search' fullWidth disableUnderline startAdornment={
            <Search/>
          }/>
          <List>
            <ListItem>
              <ListItemIcon>
                <Person/>
              </ListItemIcon>
              <ListItemText
                  primary='Jeff Jeffty'
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
  );
};

export default MessageMenu;