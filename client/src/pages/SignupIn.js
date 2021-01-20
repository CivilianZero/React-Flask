import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Hidden, makeStyles, Snackbar, TextField, Typography } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, withRouter } from 'react-router-dom';
import * as yup from 'yup';

const useStyles = makeStyles((theme) => ({
  headButton: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.getContrastText(theme.palette.primary.main),
    fontWeight: 700,
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      padding: theme.spacing(2),
      marginTop: theme.spacing(4)
    }
  },
  headSpan: {
    color: 'grey',
    fontWeight: 600,
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(4)
    }
  },
  header: {
    paddingLeft: theme.spacing(2),
    fontWeight: 'bold'
  },
  form: {
    width: '60%',
  },
  inputs: {
    padding: theme.spacing(3),
    '& > button': {
      padding: theme.spacing(2),
      width: '40%',
      fontWeight: '600',
      boxShadow: 'none'
    }
  },
  bgImg: {
    backgroundImage: 'linear-gradient(to bottom, rgba(58, 141, 255, 0.85), rgb(133, 184, 255, 0.85)), url(\'/assets/images/bg-img.png\')',
    height: '100vh',
    backgroundSize: 'cover',
  },
  imageTextDiv: {
    marginTop: '40%',
    textAlign: 'center',
  },
  imageText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 24,
  }
}));

const SignupInPage = (props) => {
  // Page text stores
  const signupText = {
    header: 'Create an account.',
    headButton: 'Login',
    headSpan: 'Already have an account?',
    submitButton: 'Create',
    snackText: 'Form failed validation!'
  }
  const loginText = {
    header: 'Welcome back!',
    headButton: 'Create Account',
    headSpan: 'Don\'t have an account?',
    submitButton: 'Login',
    snackText: 'Form failed validation!'
  }
  // State vars/hooks
  const [haveAccount, setHaveAccount] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [{ header, headButton, headSpan, submitButton, snackText }, setTextState] = useState(signupText);

  const classes = useStyles();
  const history = useHistory();

  //Form Setup
  let validationShape = {
    username: yup.string().required('Required'),
    password: yup.string().required('Required').min(6, 'Must be 6+ characters'),
    email: yup.string().email('Use proper email format.').required('Required')
  };
  if (haveAccount) {
    validationShape = {
      username: yup.string().required('Required'),
      password: yup.string().required('Required').min(6, 'Must be 6+ characters'),
    }
  }
  const validationSchema = yup.object().shape(validationShape)
  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onTouched',
  });

  // Handlers
  const onToggleClick = () => {
    if (haveAccount) {
      history.push('/signup');
    } else {
      history.push('/login');
    }
  }

  const onFormSubmit = (value) => {
    console.log(value);
  }

  const handleSnackbar = () => {
    //TODO: Add server errors once implemented
    if (errors.username || errors.email || errors.password) {
      setOpenSnackbar(true);
    }
  }
  const closeSnackbar = () => setOpenSnackbar(false);

  // Set state based on url path
  useLayoutEffect(() => {
    //TODO: logic for switching submit button function
    reset()
    if (props.location.pathname === '/login') {
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
      <Hidden smDown>
        <Grid
          className={classes.bgImg}
          item
          container
          md={4}
          justify='center'
          alignItems='center'
          alignContent='flex-start'>
          <Grid item xs={8} className={classes.imageTextDiv}>
            <object data='/assets/images/bubble.svg' type='image/svg+xml' aria-label='message bubble'/>
            <Typography className={classes.imageText} color='initial'>Converse with anyone with any language</Typography>
          </Grid>
        </Grid>
      </Hidden>
      <Grid item md container>
        <Grid item xs sm={4}/>
        <Grid item container xs={12} sm justify='flex-end' alignItems='center' alignContent='center'>
          <span className={classes.headSpan}>{headSpan}</span>
          <Button onClick={onToggleClick} className={classes.headButton} variant='contained' size='large'>
            {headButton}
          </Button>
        </Grid>
        <Grid
          container
          item
          xs={12}
          justify='center'>
          <div className={classes.form}>
            <h1 className={classes.header}>{header}</h1>
            <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
              <Grid
                item
                xs={12}
                className={classes.inputs}>
                <TextField
                  name='username'
                  inputRef={register}
                  fullWidth
                  helperText={errors.username ? errors.username.message : null}
                  error={!!errors.username}
                  id='username'
                  label='Username'
                />
              </Grid>
              {!haveAccount && <Grid
                item
                xs={12}
                className={classes.inputs}>
                <TextField
                  name='email'
                  inputRef={register}
                  fullWidth
                  helperText={errors.email ? errors.email.message : null}
                  error={!!errors.email}
                  id='email'
                  type='email'
                  label='E-Mail address'
                />
              </Grid>}
              <Grid
                item
                className={classes.inputs}
                xs={12}>
                <TextField
                  name='password'
                  inputRef={register}
                  fullWidth
                  helperText={errors.password ? errors.password.message : 'Must be 6+ characters'}
                  error={!!errors.password}
                  id='password'
                  type='password'
                  label='Password'
                />
              </Grid>
              <Grid
                className={classes.inputs}
                container
                item
                xs={12}
                justify='center'
                alignItems='center'
                alignContent='center'>
                <Button onClick={handleSnackbar} type='submit' size='large' variant='contained' color='primary'>
                  {submitButton}
                </Button>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={closeSnackbar}>
                  <MuiAlert elevation={6} variant='filled' severity='error'>
                    {snackText}
                  </MuiAlert>
                </Snackbar>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
    </Grid >
  );
}

export default withRouter(SignupInPage);