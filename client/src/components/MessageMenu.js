import { FilledInput, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { Person, Search } from '@material-ui/icons';
import React from 'react';

const MessageMenu = ({classes}) => {


	return (
		<Grid className={classes.menuRoot} container direction='column'>
			<Grid className={classes.noMaxWidth} item xs={1}>
				Logged In User
			</Grid>
			<Grid container item alignItems='stretch' justify='flex-start'>
				<Typography variant='h3'>Chats</Typography>
				<FilledInput label='Search' startAdornment={
					<Search/>
				}/>
				<List>
					<ListItem>
						<ListItemIcon>
							<Person/>
						</ListItemIcon>
						<ListItemText
							primary='Single-line item'
						/>
					</ListItem>
				</List>
			</Grid>
		</Grid>
	);
};

export default MessageMenu;