import React from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';

function Login({ isAuth, login }) {
  return isAuth ? <Redirect to="/" /> : (
    <form name="login" onSubmit={login}>
      <input type="text" name="username" placeholder="username" />
      <input type="password" name="password" placeholder="password" />
      <button type="submit" className="btn">Login</button>
    </form>
  );
}

Login.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
};

export default Login;
