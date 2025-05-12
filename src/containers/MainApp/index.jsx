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
import BulkOperationDetailsPage from '../../components/BulkOperationDetailsPage';

const task = {
    "id": 1,
    "uploaded_by": "edx",
    "created": "2025-04-17T19:17:23.366685Z",
    "modified": "2025-04-17T19:18:34.413395Z",
    "csv_file": "http://localhost:18381/media/test_xlpHF21.csv",
    "task_summary": {"errors": {"COURSE_CREATE_ERROR": [], "COURSE_UPDATE_ERROR": [], "MISSING_COURSE_TYPE": [], "MISSING_ORGANIZATION": [], "MISSING_REQUIRED_DATA": ["[MISSING_REQUIRED_DATA] Course Intro to Course Loader season 2 is missing the required data for ingestion. The missing data elements are \"verified_price\""], "IMAGE_DOWNLOAD_FAILURE": [], "COURSE_RUN_UPDATE_ERROR": [], "MISSING_COURSE_RUN_TYPE": [], "LOGO_IMAGE_DOWNLOAD_FAILURE": []}, "summary": {"others": [], "failure_count": 1, "success_count": 1, "created_products": ["41413e7e-0e08-4e43-a795-87130bd08ac3 - Intro to Course Loader (edX+CSL-700)"], "total_products_count": 2, "updated_products_count": 0}},
    "task_type": "course_create",
    "status": "pending",
    "task_id": "e40806e0-3ffc-42b5-ae01-dd3ae36d7570"
};

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
      />
    )}
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
        <Route path="/bulk-operation-tasks/:taskId" element={<BulkOperationDetailsPage />} />
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
