import { FilledInput, Grid, IconButton, InputAdornment, makeStyles, Paper, Typography } from '@material-ui/core';
import { InsertEmoticonOutlined } from '@material-ui/icons';
import React from 'react';
import { withRouter } from 'react-router-dom';
import MessageMenu from '../components/MessageMenu';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
		padding: theme.spacing(3),
	},
	statusBar: {
		height: '100%',
	},
	chatInput: {
		marginTop: theme.spacing(3),
		height: '75%',
	},
	noMaxWidth: {
		maxWidth: 'none',
	},
	menuRoot: {
		height: '100%',
		padding: 0,
	},
}));

const MessagingPage = () => {
	const classes = useStyles();

	return (
		<Grid container className={classes.root}>
			<Grid item sm={3}>
				<MessageMenu classes={classes}/>
			</Grid>
			<Grid container item sm direction='column' alignItems='stretch'>
				<Grid className={classes.noMaxWidth} item xs={1}>
					<Paper className={classes.statusBar}>
						<Typography variant='h5'>Username chatting with</Typography>
					</Paper>
				</Grid>
				<Grid container item xs direction='column' alignItems='stretch'>
					<Grid className={classes.noMaxWidth} item xs={10}>
						{/*	messages go here */}
					</Grid>
					<Grid container item xs>
						<FilledInput className={classes.chatInput} margin='dense' multiline fullWidth disableUnderline
												 placeholder='Type Something...' endAdornment={
							<InputAdornment position='end'>
								<IconButton aria-label='emoji button'>
									<InsertEmoticonOutlined/>
								</IconButton>
							</InputAdornment>
						}/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default withRouter(MessagingPage);