import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from '@edx/frontend-component-footer';

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
import SitewideBanner from '../../components/SitewideBanner';

const MainApp = () => (
  <div>
    <Header />
    {/* Only display the banner if there is content to display. */}
    {process.env.SITEWIDE_BANNER_CONTENT && (
    <SitewideBanner
      message={process.env.SITEWIDE_BANNER_CONTENT}
      type="warning"
      dismissible
      cookieName="publisherSiteWideBannerDismissed"
      cookieExpiryDays={30}
    />)}
    <main>
      <Routes>
        <Route path="/course-runs/:courseRunKey" element={<CourseRunRedirectComponent />} />
        <Route
          path="/courses/new"
          element={<CreateCourse />}
        />
        <Route path="/courses/:uuid/rerun" element={<CreateCourseRun />} />
        <Route
          path="/instructors/new"
          element={<CreateStaffer />}
        />
        <Route path="/instructors/:uuid" element={<EditStaffer />} />
        <Route
          path="/collaborators/new"
          element={<CreateCollaborator />}
        />
        <Route
          path="/collaborators/:uuid"
          element={<EditCollaborator />}
        />
        <Route path="/courses/:uuid" element={<EditCourse />} />
        <Route
          path="/"
          element={<CourseDashboard />}
        />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default MainApp;
