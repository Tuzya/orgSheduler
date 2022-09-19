import React from 'react';
import { Route, Switch } from 'react-router';
import GroupsList from '../components/GroupsList/GroupsList';
import SignUp from '../components/SignUp/SignUp';
import Login from '../components/Login/Login';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import GroupCreateForm from '../components/GroupCreateForm/GroupCreateForm';
import Schema from '../components/Schema/Schema';
import Students from '../pages/Students/Students';
import GroupPage from '../components/GroupPage/GroupPage';
import GroupEditForm from '../components/GroupEditForm/GroupEditForm';

export default function MainNav({ isAuth }) {
  return (
    <main>
      <Switch>
        <Route exact path="(/|/groups)">
          <GroupsList isAuth={isAuth} />
        </Route>
        <Route exact path="/sign-up/">
          <SignUp />
        </Route>
        <Route exact path="/login/">
          <Login isAuth={isAuth} />
        </Route>
        <PrivateRoute exact path="/groups/new/" isAuth={isAuth} component={GroupCreateForm} />
        <PrivateRoute exact path="/groups/schema/" isAuth={isAuth} component={Schema} />
        <PrivateRoute exact path="/students/" isAuth={isAuth} component={Students} />
        <Route exact path="/groups/:groupId" render={() => <GroupPage isAuth={isAuth} />} />
        <PrivateRoute
          exact
          path="/groups/:groupId/edit"
          isAuth={isAuth}
          component={GroupEditForm}
        />
        <Route path="/">{'404'}</Route>
      </Switch>
    </main>
  );
}
