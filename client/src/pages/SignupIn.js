import { Button, Grid, Hidden, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
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
		padding: theme.spacing(2),
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

const SignupInPage = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const classes = useStyles();

	return (
		<Grid
			container
		>
			<Grid item md={4}>
				<Hidden smDown>
					<img
						className={classes.image}
						alt="background"
						src="/assets/images/bg-img.png"
					/>
				</Hidden>
			</Grid>
			<Grid
				item
				md
				container
				direction="column"
				justify="center"
				alignItems="center"
				alignContent="center"
				wrap="nowrap">
				<div className={classes.form}>
					<h1 className={classes.header}>Create an account.</h1>
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
								Create
							</Button>
						</Grid>
					</form>
				</div>
			</Grid>
		</Grid >
	);
}

export default SignupInPage;