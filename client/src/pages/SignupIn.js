import { Button, Grid, Hidden, makeStyles, TextField } from '@material-ui/core';
import React, { useLayoutEffect, useState } from "react";
import { useHistory, withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	//TODO: tweak button drop shadow and position shifting on click
	headButton: {
		color: theme.palette.primary.main,
		backgroundColor: theme.palette.getContrastText(theme.palette.primary.main),
		fontWeight: 700,
		padding: theme.spacing(2),
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
		marginLeft: theme.spacing(4),
		marginRight: theme.spacing(4),
		[theme.breakpoints.down("sm")]: {
			marginTop: theme.spacing(4)
		}
	},
	headSpan: {
		color: 'grey',
		fontWeight: 600
	},
	header: {
		paddingLeft: theme.spacing(2),
		fontWeight: 'bold'
	},
	image: {
		height: '100vh',
	},
	form: {
		width: '60%',
	},
	inputs: {
		padding: theme.spacing(3),
		'& > div': {
			width: '100%',
		},
		'& > button': {
			padding: theme.spacing(2),
			width: '40%',
			fontWeight: '600',
			boxShadow: 'none'
		}
	}
}));

const SignupInPage = (props) => {
	// Page text stores
	const signupText = {
		header: 'Create an account.',
		headButton: 'Login',
		headSpan: 'Already have an account?',
		submitButton: 'Create'
	}
	const loginText = {
		header: 'Welcome back!',
		headButton: 'Create Account',
		headSpan: 'Don\'t have an account?',
		submitButton: 'Login'
	}
	// State vars/hooks
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [haveAccount, setHaveAccount] = useState(false);
	const [{ header, headButton, headSpan, submitButton }, setTextState] = useState(signupText);

	const classes = useStyles();
	const history = useHistory();

	// Handlers
	const onToggleClick = () => {
		if (haveAccount) {
			history.push("/signup");
		} else {
			history.push("/login");
		}
	}

	// Set state based on url path
	useLayoutEffect(() => {
		//TODO: logic for switching submit button function
		if (props.location.pathname === "/login") {
			setHaveAccount(true);
			setTextState(loginText);
		} else {
			setHaveAccount(false);
			setTextState(signupText);
		}
	}, [props.location.pathname])

	return (
		<Grid
			container
		>
			<Grid item md={4} id="gradient-image">
				<Hidden smDown>
					<img
						className={classes.image}
						alt="background"
						src="/assets/images/bg-img.png"
					/>
				</Hidden>
			</Grid>
			<Grid item md container>
				<Grid item xs={1} sm={4}></Grid>
				<Grid item container xs sm justify="flex-end" alignItems="center">
					<span className={classes.headSpan}>{headSpan}</span>
					<Button onClick={onToggleClick} className={classes.headButton} variant="contained" size="large">
						{headButton}
					</Button>
				</Grid>
				<Grid
					container
					item
					xs={12}
					justify="center">
					<div className={classes.form}>
						<h1 className={classes.header}>{header}</h1>
						<form>
							<Grid
								item
								xs={12}
								className={classes.inputs}>
								<TextField
									id="username"
									label="Username"
									value={username}
									onChange={e => setUsername(e.target.value)}
								/>
							</Grid>
							<Grid
								hidden={haveAccount}
								item
								xs={12}
								className={classes.inputs}>
								<TextField
									id="email"
									type="email"
									label="E-Mail address"
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
							</Grid>
							<Grid
								item
								className={classes.inputs}
								xs={12}>
								<TextField
									id="password"
									type="password"
									label="Password"
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
							</Grid>
							<Grid
								className={classes.inputs}
								container
								item
								xs={12}
								justify="center"
								alignItems="center"
								alignContent="center">
								<Button size="large" variant="contained" color="primary">
									{submitButton}
								</Button>
							</Grid>
						</form>
					</div>
				</Grid>
			</Grid>
		</Grid >
	);
}

export default withRouter(SignupInPage);