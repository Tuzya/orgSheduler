import React from 'react';
import { Route, Switch } from 'react-router-dom';
import GroupsList from '../pages/GroupsList/GroupsList';
import SignUp from '../pages/SignUp/SignUp';
import Login from '../pages/Login/Login';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import GroupCreateForm from '../pages/GroupCreateForm/GroupCreateForm';
import Schema from '../pages/Schema/Schema';
import Students from '../pages/Students/Students';
import GroupPage from '../pages/GroupPage/GroupPage';
import GroupEditForm from '../pages/GroupEditForm/GroupEditForm';
import StudentEditForm from "../pages/Students/StudentEditForm"

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
        <PrivateRoute exact path="/students/:studentId" isAuth={isAuth} component={StudentEditForm} />
        <Route exact path="/groups/:groupId"><GroupPage isAuth={isAuth} /></Route>
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
