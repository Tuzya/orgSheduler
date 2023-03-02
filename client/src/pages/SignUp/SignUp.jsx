import React from 'react';
import { useHistory } from 'react-router-dom';
import { createUser } from '../../store/auth/actions';
import { useDispatch } from 'react-redux';
import { Avatar, Button, TextField, Box, Typography, Container, Stack } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';

export default function SignUp() {
  const history = useHistory();
  const dispatch = useDispatch();
  const createUserHandler = (e) => dispatch(createUser(e, history));

  return (
    <Container component="main" maxWidth="xl" sx={{ mt: 0 }}>
      <Box sx={styles.formbox}>
        <Avatar sx={{ m: 1, width: 60, height: 60, bgcolor: 'secondary.main' }}>
          <BorderColorIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          User create
        </Typography>
      </Box>
      <Box component="form" sx={{ mt: 1 }} onSubmit={createUserHandler}>
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
          name="email"
          type="email"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
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
        <TextField
          name="secret"
          type="password"
          margin="normal"
          required
          fullWidth
          id="secret"
          label="Secret"
        />

        <Stack sx={{ p: 4 }} direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" type="submit">
            SignUp
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
