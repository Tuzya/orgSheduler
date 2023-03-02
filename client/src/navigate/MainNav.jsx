import React, {Suspense, lazy} from 'react';
import { Route, Switch } from 'react-router-dom';

const GroupsList = lazy(() => import('../pages/GroupsList/GroupsList'));
const SignUp = lazy(() => import('../pages/SignUp/SignUp'));
const Login = lazy(() => import('../pages/Login/Login'));
const PrivateRoute = lazy(() => import('../components/PrivateRoute/PrivateRoute'));
const GroupCreateForm = lazy(() => import('../pages/GroupCreateForm/GroupCreateForm'));
const Schema = lazy(() => import('../pages/Schema/Schema'));
const Students = lazy(() => import('../pages/Students/Students'));
const GroupPage = lazy(() => import('../pages/GroupPage/GroupPage'));
const GroupEditForm = lazy(() => import('../pages/GroupEditForm/GroupEditForm'));
const StudentProfile = lazy(() => import("../pages/Students/StudentProfile"));
const StudentsCreate = lazy(() => import("../pages/Students/StudentsCreate"));
const SdudentEdit = lazy(() => import("../pages/Students/SdudentEdit"));

export default function MainNav({ isAuth }) {
  return (
    <main>
      <Suspense fallback={<div className="spinner" />}>
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
          <PrivateRoute exact path="/groups/new/" isAuth={isAuth} component={() => <GroupCreateForm/>} />
          <PrivateRoute exact path="/groups/schema/" isAuth={isAuth} component={() => <Schema/>} />
          <PrivateRoute exact path="/students/" isAuth={isAuth} component={() => <Students/>} />
          <PrivateRoute exact path="/students/new" isAuth={isAuth} component={() => <StudentsCreate/>} />
          <PrivateRoute exact path="/students/:studentId" isAuth={isAuth} component={() => <StudentProfile/>} />
          <PrivateRoute exact path="/students/:studentId/edit" isAuth={isAuth} component={() => <SdudentEdit/>} />
          <Route exact path="/groups/:groupId"><GroupPage isAuth={isAuth} /></Route>
          <PrivateRoute exact path="/groups/:groupId/edit" isAuth={isAuth} component={() => <GroupEditForm/>}/>
          <Route path="/">{'404'}</Route>
        </Switch>
      </Suspense>
    </main>
  );
}
