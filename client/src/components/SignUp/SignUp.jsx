import React from 'react';
import { useHistory } from 'react-router-dom';

export default function SignUp() {
  const history = useHistory();
  const createUser = async (e) => {
    e.preventDefault();
    const user = [...e.target.elements]
      .reduce((acc, el) => (el.value ? { ...acc, [el.name]: el.value } : acc), {});
    const signUpResponse = await fetch('/api/sign-up', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (signUpResponse.status === 200) {
      history.push('/login');
    } else {
      console.log(signUpResponse);
      alert(signUpResponse.status);
    }
  };

  return (
    <form name="signup" onSubmit={createUser}>
      <input type="text" name="username" placeholder="username" required />
      <input type="email" name="email" placeholder="email" required />
      <input type="password" name="password" placeholder="password" required />
      <input type="password" name="secret" placeholder="secret" required />
      <button type="submit" className="btn">SignUp</button>
    </form>
  );
}
