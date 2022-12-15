import actionTypes from '../types';

const setAuth = (isAuth) => ({ type: actionTypes.SET_AUTH, payload: { isAuth } });
// const setUser = (user) => ({ type: actionTypes.SET_USER, payload: { user } });
const setLoading = (isLoading) => ({ type: actionTypes.SET_AUTH_LOADING, payload: { isLoading } });

export const checkAuth = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const authResponse = await fetch('/api/check-auth');
    let auth = await authResponse.text();
    auth = auth === 'true';
    dispatch(setAuth(auth));
  } catch (e) {
    console.error('Failed chech-auth', e.message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const login = (e) => async (dispatch) => {
  e.preventDefault();
  dispatch(setLoading(true));
  const { username, password } = e.target;
  try {
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });
    const data = await loginResponse.json();
    if (loginResponse.status === 202) return dispatch(setAuth(true));
      console.error('Login error:', data.err)
      alert(`${loginResponse.status} ${data.err}`);

  } catch (e) {
    console.log('Login error:', e.message);
    alert(`Login error:, ${e.message}`);
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = (e) => async (dispatch) => {
  e.preventDefault();
  dispatch(setLoading(true));
  try {
    const logoutResponse = await fetch('/api/logout');
    if (logoutResponse.status === 200) {
      dispatch(setAuth(false));
    } else {
      alert(logoutResponse.status);
    }
  } catch (e) {
    console.log('Logout err:', e.message);
    alert(`Logout err: ${e.message}`);
  } finally {
    dispatch(setLoading(false));
  }
};

export const createUser = (e, history) => async (dispatch) => {
  e.preventDefault();
  const user = [...e.target.elements].reduce(
    (acc, el) => (el.value ? { ...acc, [el.name]: el.value } : acc),
    {}
  );
  try {
    const signUpResponse = await fetch('/api/sign-up', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    const data = await signUpResponse.json();
    if (signUpResponse.status === 200) return history.push('/login');
    console.log('signUpResponse', signUpResponse);
    alert(`${signUpResponse.status} ${data.err}`);
  } catch (e) {
    console.log('sign-up error:', e);
    alert(`sign-up error: ${e.message}`);
  }
};
