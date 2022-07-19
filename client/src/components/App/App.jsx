import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

// TODO: create own Route component.
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import SignUp from '../SignUp/SignUp';
import Login from '../Login/Login';
import GroupCreateForm from '../GroupCreateForm/GroupCreateForm';
import GroupsList from '../GroupsList/GroupsList';
import GroupPage from '../GroupPage/GroupPage';
import GroupEditForm from '../GroupEditForm/GroupEditForm';
import Header from '../Header/Header';
import './App.css';
import Schema from '../Schema/Schema';

function App() {
  const [loading, setLoading] = useState(false);
  const [isAuth, setAuth] = useState(false);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const authResponse = await fetch('/api/check-auth');
      let auth = await authResponse.text();
      auth = auth === 'true';
      setAuth(auth);
    } catch (e) {
      console.error('Failed chech-auth', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, password } = e.target;
    try {
      const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });
      if (loginResponse.status === 202) {
        setAuth(true);
      } else {
        alert(loginResponse.status);
      }
    } catch (e) {
      console.log('Login error:', e.message);
      alert(`Login error:, ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const logoutResponse = await fetch('/api/logout');
      if (logoutResponse.status === 200) {
        setAuth(false);
      } else {
        alert(logoutResponse.status);
      }
    } catch (e) {
      console.log('Logout err:', e.message);
      alert(`Logout err: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header isAuth={isAuth} logout={logout} />
      {loading ? (
        <div className="spinner" />
      ) : (
        <main>
          <Switch>
            <Route
              exact
              path="(/|/groups)"
              render={() => <GroupsList isAuth={isAuth} />}
            />
            <Route exact path="/sign-up/" component={SignUp} />
            <Route
              exact
              path="/login/"
              render={() => <Login isAuth={isAuth} login={login} />}
            />
            <PrivateRoute
              exact
              path="/groups/new/"
              isAuth={isAuth}
              component={GroupCreateForm}
            />
            <PrivateRoute
              exact
              path="/groups/schema/"
              isAuth={isAuth}
              component={Schema}
            />
            <Route exact path="/groups/:groupId" render={() => <GroupPage isAuth={isAuth}/>} />
            <PrivateRoute
              exact
              path="/groups/:groupId/edit"
              isAuth={isAuth}
              component={GroupEditForm}
            />
            <Route path="/" render={() => '404'} />
          </Switch>
        </main>
      )}
    </div>
  );
}

export default App;
