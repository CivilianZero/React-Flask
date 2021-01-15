import { Button, Grid, Hidden, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
	image: {
		height: '100vh',
	},
	form: {
		width: '100%',
	},
	inputs: {
		padding: 20,
		width: '80%',
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
			justify="center"
			alignItems="center"
			alignContent="center"
			wrap="nowrap"
		>
			<Grid item sm>
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
				xs={12}
				sm={7}
				container
				spacing={10}
				justify="center"
				alignItems="center"
				alignContent="center"
				wrap="nowrap">
				<div className={classes.form}>
					<h1>Create an account.</h1>
					<form>
						<Grid item xs={12}>
							<TextField
								className={classes.inputs}
								id="username"
								label="Username"
								value={username}
								onChange={e => setUsername(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								className={classes.inputs}
								id="email"
								type="email"
								label="E-Mail address"
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								className={classes.inputs}
								id="password"
								type="password"
								label="Password"
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<Button variant="contained" color="primary">
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