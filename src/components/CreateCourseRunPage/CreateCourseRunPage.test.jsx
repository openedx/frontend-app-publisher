import React from 'react';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';

import { CreateCourseRunForm } from './CreateCourseRunForm';
import CreateCourseRunPage from './index';
import { courseOptions } from '../../data/constants/testData';
import createRootReducer from '../../data/reducers';

describe('CreateCourseRunPage', () => {
  it('renders html correctly', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: false,
        isCreating: false,
        error: null,
      }}
      courseOptions={courseOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
  it('renders html correctly with Course Type', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {
          type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
        },
        isFetching: false,
        isCreating: false,
        error: null,
      }}
      courseOptions={courseOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
  it('renders html correctly when fetching', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: true,
        isCreating: false,
        error: null,
      }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
  it('renders html correctly when creating', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: false,
        isCreating: true,
        error: null,
      }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
  it('renders html correctly when error', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: false,
        isCreating: false,
        error: ['failed'],
      }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('refuses access to form when course is under review', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {
          course_runs: [{
            status: 'review_by_legal',
            key: 'course-v1:edX+cs101+2T2019',
          }],
          title: 'Test Course',
        },
        isFetching: false,
        isCreating: false,
        error: null,
      }}
    />);

    // Confirm message is shown
    const reviewAlert = component.find(Alert);
    const reviewMessage = 'Test Course has been submitted for review. No course runs can be added right now.';
    expect(reviewAlert.text()).toEqual(reviewMessage);

    // And confirm that we don't show form
    const form = component.find(CreateCourseRunForm);
    expect(form).toHaveLength(0);
  });

  it.each(['instructor_paced', 'self_paced'])('default pacing options match last run', (pacing) => {
    const store = createStore(createRootReducer());
    const CreateCourseRunPageWrapper = () => (
      <MemoryRouter>
        <Provider store={store}>
          <IntlProvider locale="en">
            <CreateCourseRunPage
              id="00000000-0000-0000-0000-000000000001"
              courseInfo={{
                data: {
                  course_runs: [{
                    status: 'unpublished',
                    key: 'course-v1:edX+cs101+2T2019',
                    pacing_type: pacing,
                  }],
                  title: 'Test Course',
                },
                isFetching: false,
                isCreating: false,
                error: null,
              }}
              courseRunOptions={{
                data: {
                  actions: {
                    POST: {
                      pacing_type: {
                        choices: [
                          { value: 'instructor_paced', display_name: 'Instructor-paced' },
                          { value: 'self_paced', display_name: 'Self-paced' },
                        ],
                      },
                    },
                  },
                },
              }}
            />
          </IntlProvider>
        </Provider>
      </MemoryRouter>
    );

    const component = mount(CreateCourseRunPageWrapper());

    const pacingSelect = component.find({ name: 'pacing_type' }).hostNodes().find('select');
    expect(pacingSelect.props().value).toEqual(pacing);
  });
});
