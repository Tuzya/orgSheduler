import React from 'react';
import { login } from '../../store/auth/actions';
import { useDispatch } from 'react-redux';
import { Avatar, Button, TextField, Box, Typography, Container, Stack } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


function Login({isAuth}) {
  const dispatch = useDispatch();
  const loginHandler = (e) => dispatch(login(e));

  if(isAuth) return <Redirect to="/" />

  return (
    <Container component="main" maxWidth="xl" sx={{ mt: 0 }}>
      <Box sx={styles.formbox}>
        <Avatar sx={{ m: 1, width: 60, height: 60, bgcolor: 'secondary.main' }}>
          <BorderColorIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          User login
        </Typography>
      </Box>
      <Box component="form" sx={{ mt: 1 }} onSubmit={loginHandler}>
        <TextField
          name="username"
          type="text"
          margin="normal"
          required
          fullWidth
          id="name"
          label="User Name"
        />
        <TextField
          name="password"
          type="password"
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
        />
        <Stack sx={{ p: 4 }} direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" type="submit">
            Login
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

const styles = {
  formbox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

Login.propTypes = {
  isAuth: PropTypes.bool.isRequired
};

export default Login;

