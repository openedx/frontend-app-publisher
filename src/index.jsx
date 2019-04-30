import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PrivateRoute } from '@edx/frontend-auth';
import SiteFooter from '@edx/frontend-component-footer';

import './sass/App.scss';
import history from './data/history';
import store from './data/store';
import Header from './containers/Header';
import FooterLogo from '../assets/edx-footer.png';
import CourseDashboard from './containers/CourseDashboard';
import CreateCourse from './containers/CreateCourse';
import CreateCourseRun from './containers/CreateCourseRun';
import CreateStaffer from './containers/CreateStaffer';
import EditStaffer from './containers/EditStaffer';

import apiClient from './data/apiClient';
import EditCourse from './containers/EditCourse';


const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Header />
        <main>
          <Switch>
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
              path="/"
              exact
              component={CourseDashboard}
              authenticatedAPIClient={apiClient}
              redirect={`${process.env.BASE_URL}`}
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
          facebookUrl={process.env.FACEBOOK_URL}
          twitterUrl={process.env.TWITTER_URL}
          youTubeUrl={process.env.YOU_TUBE_URL}
          linkedInUrl={process.env.LINKED_IN_URL}
          googlePlusUrl={process.env.GOOGLE_PLUS_URL}
          redditUrl={process.env.REDDIT_URL}
          appleAppStoreUrl={process.env.APPLE_APP_STORE_URL}
          googlePlayUrl={process.env.GOOGLE_PLAY_URL}
        />
      </div>
    </ConnectedRouter>
  </Provider>
);

apiClient.ensurePublicOrAuthenticationAndCookies(
  window.location.pathname,
  () => {
    ReactDOM.render(<App />, document.getElementById('root'));
  },
);
