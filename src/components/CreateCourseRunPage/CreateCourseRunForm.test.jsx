import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import { reduxForm } from 'redux-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { courseOptions, courseRunOptions } from '../../data/constants/testData';
import { getOptionsData, parseCourseTypeOptions } from '../../utils';
import { BaseCreateCourseRunForm } from './CreateCourseRunForm';

Date.now = jest.fn(() => new Date(Date.UTC(2001, 0, 1)).valueOf());
const WrappedCreateCourseRunForm = reduxForm({ form: 'testForm' })(BaseCreateCourseRunForm);
const mockStore = configureStore();
const store = mockStore({});

function findInput(container, name) {
  return (
    container.querySelector(`input[name="${name}"]`)
    || container.querySelector(`input[id*="${name}"]`)
    || container.querySelector(`input[name*="${name}"]`)
    || container.querySelector(`input[id^="${name}"]`)
    || null
  );
}

describe('CreateCourseRunForm', () => {
  it('renders html correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <WrappedCreateCourseRunForm
            handleSubmit={() => {}}
            initialValues={{
              course: 'edx+test101',
            }}
            title="Test Course"
            uuid="00000000-0000-0000-0000-000000000001"
            pristine
            isCreating={false}
            courseRunOptions={courseRunOptions}
          />
        </Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
  it('renders html correctly with Course Type', () => {
    const courseTypeUuid = '8a8f30e1-23ce-4ed3-a361-1325c656b67b';
    const courseOptionsData = getOptionsData(courseOptions);
    const parsedTypeOptions = parseCourseTypeOptions(courseOptionsData.type.type_options);
    const { courseRunTypeOptions } = parsedTypeOptions;
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <WrappedCreateCourseRunForm
            handleSubmit={() => {}}
            initialValues={{
              course: 'edx+test101',
            }}
            title="Test Course"
            uuid="00000000-0000-0000-0000-000000000001"
            pristine
            isCreating={false}
            courseRunTypeOptions={courseRunTypeOptions[courseTypeUuid]}
            courseRunOptions={courseRunOptions}
            courseTypeUuid={courseTypeUuid}
          />
        </Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
  it('renders html correctly when creating', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <WrappedCreateCourseRunForm
            handleSubmit={() => {}}
            initialValues={{
              course: 'edx+test101',
            }}
            title="Test Course"
            uuid="00000000-0000-0000-0000-000000000001"
            pristine={false}
            isCreating
            courseRunOptions={courseRunOptions}
          />
        </Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
  it('renders credit seat metadata fields when seat type is credit', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <WrappedCreateCourseRunForm
            handleSubmit={() => {}}
            initialValues={{ course: 'edx+credit101' }}
            title="Credit Course"
            uuid="00000000-0000-0000-0000-000000000002"
            pristine
            isCreating={false}
            courseRunOptions={courseRunOptions}
            currentFormValues={{
              seats: [{ type: 'credit' }],
            }}
          />
        </Provider>
      </MemoryRouter>,
    );

    const creditProviderInput = findInput(container, 'credit_provider');
    const creditHoursInput = findInput(container, 'credit_hours');
    const upgradeDeadlineInput = findInput(container, 'upgrade_deadline');

    const text = container.textContent || '';
    const hasLabels = /credit provider/i.test(text)
      && /credit hours/i.test(text) && /upgrade deadline/i.test(text);

    expect(
      creditProviderInput || creditHoursInput || upgradeDeadlineInput || hasLabels,
    ).toBeTruthy();
  });
  it('does not render credit seat metadata fields when no credit seat exists', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <WrappedCreateCourseRunForm
            handleSubmit={() => {}}
            initialValues={{ course: 'edx+test101' }}
            title="Non-credit Course"
            uuid="00000000-0000-0000-0000-000000000003"
            pristine
            isCreating={false}
            courseRunOptions={courseRunOptions}
            currentFormValues={{
              seats: [{ type: 'verified' }],
            }}
          />
        </Provider>
      </MemoryRouter>,
    );

    const creditProviderInput = findInput(container, 'credit_provider');
    const creditHoursInput = findInput(container, 'credit_hours');
    const upgradeDeadlineInput = findInput(container, 'upgrade_deadline');
    const text = container.textContent || '';

    expect(creditProviderInput).toBeNull();
    expect(creditHoursInput).toBeNull();
    expect(upgradeDeadlineInput).toBeNull();
    expect(/credit provider/i.test(text)).toBe(false);
    expect(/credit hours/i.test(text)).toBe(false);
    expect(/upgrade deadline/i.test(text)).toBe(false);
  });
});
