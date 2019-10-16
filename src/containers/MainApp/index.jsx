import 'babel-polyfill';
import React from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute } from '@edx/frontend-auth';
import SiteFooter from '@edx/frontend-component-footer';

import {
  faFacebookSquare,
  faTwitterSquare,
  faLinkedin,
  faRedditSquare,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../../sass/App.scss';
import Header from '../../containers/Header';
import FooterLogo from '../../../assets/edx-footer.png';
import CourseDashboard from '../../containers/CourseDashboard';
import CourseRunRedirectComponent from '../../components/CourseRunRedirect';
import CreateCourse from '../../containers/CreateCourse';
import CreateCourseRun from '../../containers/CreateCourseRun';
import CreateStaffer from '../../containers/CreateStaffer';
import EditStaffer from '../../containers/EditStaffer';

import apiClient from '../../data/apiClient';
import EditCourse from '../../containers/EditCourse';

const socialLinks = [
  {
    title: 'Facebook',
    url: process.env.FACEBOOK_URL,
    icon: <FontAwesomeIcon icon={faFacebookSquare} className="social-icon" size="2x" />,
    screenReaderText: 'Like edX on Facebook',
  },
  {
    title: 'Twitter',
    url: process.env.TWITTER_URL,
    icon: <FontAwesomeIcon icon={faTwitterSquare} className="social-icon" size="2x" />,
    screenReaderText: 'Follow edX on Twitter',
  },
  {
    title: 'LinkedIn',
    url: process.env.LINKED_IN_URL,
    icon: <FontAwesomeIcon icon={faLinkedin} className="social-icon" size="2x" />,
    screenReaderText: 'Follow edX on LinkedIn',
  },
  {
    title: 'Reddit',
    url: process.env.REDDIT_URL,
    icon: <FontAwesomeIcon icon={faRedditSquare} className="social-icon" size="2x" />,
    screenReaderText: 'Subscribe to the edX subreddit',
  },
];

const MainApp = () => (
  <div>
    <Header />
    <main>
      <Switch>
        <PrivateRoute
          path="/course-runs/:key"
          exact
          authenticatedAPIClient={apiClient}
          render={({ match: { params: { key } } }) => (
            <CourseRunRedirectComponent courseRunKey={key} />
          )}
        />
        <PrivateRoute
          path="/courses/new"
          exact
          component={CreateCourse}
          authenticatedAPIClient={apiClient}
          redirect={`${process.env.BASE_URL}`}
        />
        <PrivateRoute
          path="/courses/:id/rerun"
          exact
          component={({ match }) => (
            <CreateCourseRun id={match.params.id} />
          )}
          authenticatedAPIClient={apiClient}
          redirect={`${process.env.BASE_URL}`}
        />
        <PrivateRoute
          path="/instructors/new"
          exact
          component={CreateStaffer}
          authenticatedAPIClient={apiClient}
          redirect={`${process.env.BASE_URL}`}
        />
        <PrivateRoute
          path="/instructors/:uuid"
          exact
          render={({ match }) => (
            <EditStaffer uuid={match.params.uuid} />
          )}
        />
        <PrivateRoute
          path="/courses/:id"
          exact
          render={({ match }) => (
            <EditCourse id={match.params.id} />
          )}
          authenticatedAPIClient={apiClient}
          redirect={`${process.env.BASE_URL}`}
        />
        <PrivateRoute
          path="/"
          exact
          component={CourseDashboard}
          authenticatedAPIClient={apiClient}
          redirect={`${process.env.BASE_URL}`}
        />
      </Switch>
    </main>
    <SiteFooter
      siteName={process.env.SITE_NAME}
      siteLogo={FooterLogo}
      marketingSiteBaseUrl={process.env.MARKETING_SITE_BASE_URL}
      supportUrl={process.env.SUPPORT_URL}
      contactUrl={process.env.CONTACT_URL}
      openSourceUrl={process.env.OPEN_SOURCE_URL}
      termsOfServiceUrl={process.env.TERMS_OF_SERVICE_URL}
      privacyPolicyUrl={process.env.PRIVACY_POLICY_URL}
      appleAppStoreUrl={process.env.APPLE_APP_STORE_URL}
      googlePlayUrl={process.env.GOOGLE_PLAY_URL}
      socialLinks={socialLinks}
      enterpriseMarketingLink={{
        url: process.env.ENTERPRISE_MARKETING_URL,
        queryParams: {
          utm_source: process.env.ENTERPRISE_MARKETING_UTM_SOURCE,
          utm_campaign: process.env.ENTERPRISE_MARKETING_UTM_CAMPAIGN,
          utm_medium: process.env.ENTERPRISE_MARKETING_FOOTER_UTM_MEDIUM,
        },
      }}
    />
  </div>
);

export default MainApp;
