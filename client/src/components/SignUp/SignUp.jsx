import React from 'react';
import { useHistory } from 'react-router-dom';
import { createUser } from '../../store/auth/actions';
import { useDispatch } from 'react-redux';

export default function SignUp() {
  const history = useHistory();
  const dispatch = useDispatch();
  const createUserHandler = (e) => dispatch(createUser(e, history));

  return (
    <form name="signup" onSubmit={createUserHandler}>
      <input type="text" name="username" placeholder="username" required />
      <input type="email" name="email" placeholder="email" required />
      <input type="password" name="password" placeholder="password" required />
      <input type="password" name="secret" placeholder="secret" required />
      <button type="submit" className="btn">
        SignUp
      </button>
    </form>
  );
}
