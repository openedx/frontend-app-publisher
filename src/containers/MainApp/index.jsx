import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Footer from '@edx/frontend-component-footer-edx';

import '../../sass/App.scss';
import Header from '../Header';
import CourseDashboard from '../CourseDashboard';
import CourseRunRedirectComponent from '../../components/CourseRunRedirect';
import CreateCourse from '../CreateCourse';
import CreateCourseRun from '../CreateCourseRun';
import CreateStaffer from '../CreateStaffer';
import EditStaffer from '../EditStaffer';
import CreateCollaborator from '../CreateCollaborator';
import EditCollaborator from '../EditCollaborator';
import EditCourse from '../EditCourse';

const MainApp = () => (
  <div>
    <Header />
    <main>
      <Switch>
        <Route
          path="/course-runs/:key"
          exact
          render={({ match: { params: { key } } }) => (
            <CourseRunRedirectComponent courseRunKey={key} />
          )}
        />
        <Route
          path="/courses/new"
          exact
          component={CreateCourse}
        />
        <Route
          path="/courses/:uuid/rerun"
          exact
          render={({ match }) => (
            <CreateCourseRun uuid={match.params.uuid} />
          )}
        />
        <Route
          path="/instructors/new"
          exact
          component={CreateStaffer}
        />
        <Route
          path="/instructors/:uuid"
          exact
          render={({ match }) => (
            <EditStaffer uuid={match.params.uuid} />
          )}
        />
        <Route
          path="/collaborators/new"
          exact
          component={CreateCollaborator}
        />
        <Route
          path="/collaborators/:uuid"
          exact
          component={EditCollaborator}
        />
        <Route
          path="/courses/:uuid"
          exact
          render={({ match }) => (
            <EditCourse uuid={match.params.uuid} />
          )}
        />
        <Route
          path="/"
          exact
          component={CourseDashboard}
        />
      </Switch>
    </main>
    <Footer />
  </div>
);

export default MainApp;
