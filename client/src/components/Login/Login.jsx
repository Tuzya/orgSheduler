import React from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { login } from '../../store/auth/actions';
import { useDispatch } from "react-redux"

function Login({ isAuth }) {
  const dispatch = useDispatch();
  const loginHandler = (e) => dispatch(login(e));

  return isAuth ? (
    <Redirect to="/" />
  ) : (
    <form name="login" onSubmit={loginHandler}>
      <input type="text" name="username" placeholder="username" required />
      <input type="password" name="password" placeholder="password" required />
      <button type="submit" className="btn">
        Login
      </button>
    </form>
  );
}

Login.propTypes = {
  isAuth: PropTypes.bool.isRequired
};

export default Login;
