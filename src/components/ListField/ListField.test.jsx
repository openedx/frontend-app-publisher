import React from 'react';
import {
  render, waitFor, screen, fireEvent,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import ListField from './index';
import { Collaborator } from '../Collaborator';
import renderSuggestion from '../Collaborator/renderSuggestion';
import fetchCollabSuggestions from '../Collaborator/fetchCollabSuggestions';
import renderStaffSuggestion from '../Staffer/renderStaffSuggestion';
import fetchStaffSuggestions from '../Staffer/fetchStaffSuggestions';
import { Staffer } from '../Staffer';

const mockClient = new MockAdapter(axios);

const collaboratorInput = {
  name: 'collaborators',
  value: [
    {
      uuid: '6f23f2f8-10dd-454a-8497-2ba972c980c4',
      name: 'Waseda',
      image_url: '/assets/new-80.png',
    },
    {
      uuid: '17d0e2c0-9a02-421b-93bf-d081339090cc',
      name: 'IBM',
      image_url: '/assets/new-80.png',
    },
    {
      uuid: '2aba6189-ad7e-45a8-b269-bea071b80391',
      name: 'Wellesley',
      image_url: '/assets/new-80.png',
    },
  ],
  onChange: jest.fn(),
};
const owners = [{ key: 'MITx' }];
const autoCompleteCollaboratorResponses = [
  {
    uuid: 'a7d0e2c0-9a02-421b-93bf-d081339090cc',
    image_url: '/assets/new-80.png',
    name: 'MIT',
  },
  {
    uuid: 'b7d0e2c0-9a02-421b-93bf-d081339090cc',
    image_url: '/assets/new-80.png',
    name: 'Berkeley',
  },
];

const collaboratorDefaultProps = {
  input: collaboratorInput,
  referrer: '/courses/00000000-0000-0000-0000-000000000000',
  fetchSuggestions: fetchCollabSuggestions(autoCompleteCollaboratorResponses),
  renderSuggestion,
  renderItemComponent: Collaborator,
  createNewUrl: '/collaborators/new',
  itemType: 'Collaborator',
  meta: {
    submitFailed: false,
    error: '',
  },
  newItemText: 'Add New Collaborator',
};

const newCollaborator = {
  uuid: '00000000-0000-0000-0000-000000000000',
  image_url: '/assets/new-80.png',
  name: 'I am a school',
};

const collaboratorReferredProps = {
  ...collaboratorDefaultProps,
  newItemInfo: {
    data: newCollaborator,
  },
  sourceInfo: {
    referringRun: 'DemoX+TestCourse',
  },
};

const stafferInput = {
  value: [
    {
      uuid: '6f23f2f8-10dd-454a-8497-2ba972c980c4',
      given_name: 'First',
      family_name: 'Last',
      profile_image_url: '/media/people/profile_images/6f23f2f8-10dd-454a-8497-2ba972c980c4-a411afec9477.jpeg',
    },
    {
      uuid: '17d0e2c0-9a02-421b-93bf-d081339090cc',
      given_name: 'Pippa',
      family_name: null,
      profile_image_url: '/media/people/profile_images/17d0e2c0-9a02-421b-93bf-d081339090cc-68912d27b6e7.jpeg',
    },
    {
      uuid: '2aba6189-ad7e-45a8-b269-bea071b80391',
      given_name: 'Dave',
      family_name: 'Grohl',
      profile_image_url: '/media/people/profile_images/2aba6189-ad7e-45a8-b269-bea071b80391-11df6812f839.png',
    },
  ],
  onChange: jest.fn(),
};
const mockAutoCompletePersonResponses = {
  long: [
    {
      uuid: 'a7d0e2c0-9a02-421b-93bf-d081339090cc',
      profile_image_url: '/assets/new-80.png',
      given_name: 'Pippi',
      family_name: 'Longstocking',
    },
    {
      uuid: 'b7d0e2c0-9a02-421b-93bf-d081339090cc',
      profile_image_url: '/assets/new-80.png',
      given_name: 'Hank',
      family_name: 'Longfellow',
    }],
};

const staffDefaultProps = {
  input: stafferInput,
  meta: {
    submitFailed: false,
    error: '',
  },
  courseUuid: '11111111-1111-1111-1111-111111111111',
  courseRunKey: 'DemoX+TestCourse',
  referrer: '/courses/11111111-1111-1111-1111-111111111111',
  itemType: 'staff',
  createNewUrl: '/instructors/new',
  renderItemComponent: Staffer,
  renderSuggestion: renderStaffSuggestion,
  fetchSuggestions: fetchStaffSuggestions(owners),
  newItemText: 'Add New Instructor',

};

const newStaffer = {
  uuid: '00000000-0000-0000-0000-000000000000',
  profile_image_url: '/assets/pic.png',
  given_name: 'Person',
  family_name: 'McPerson',
};

const staffReferredProps = {

  ...staffDefaultProps,
  newItemInfo: {
    data: newStaffer,
  },
  sourceInfo: {
    referringRun: 'DemoX+TestCourse',
  },
};

jest.mock('../Staffer', () => ({
  Staffer: () => <div className="mock-staffer" />,
  // mock a generic name function so that drag and drop works
  getStafferName: staffer => staffer.given_name,
  fetchStaffSuggestions: jest.fn(),
}));

jest.mock('../Collaborator', () => ({
  Collaborator: () => <div data-testid="mock-collaborator" className="mock-collaborator" />,
}));

describe('ListField - Collaborators', () => {
  afterEach(() => {
    // Clear onChange's call count after each test
    collaboratorInput.onChange.mockClear();
    // reset api client response
    mockClient.reset();
  });

  it('renders a list of item members and an autocomplete input', () => {
    const { container } = render(<ListField {...collaboratorDefaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with referred props', async () => {
    const { container } = render(<ListField {...collaboratorReferredProps} />);
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders correctly with an error after failed submission', async () => {
    const metaFailedProps = {

      ...collaboratorDefaultProps,
      meta: {
        submitFailed: true,
        error: 'This field is required',
      },
    };
    const { container } = render(<ListField {...metaFailedProps} />);
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('gets/clears suggestions for autocomplete', async () => {
    render(<ListField {...collaboratorDefaultProps} owners={owners} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'mit');
    const suggestionsList = await screen.findAllByTestId('list-field-suggestion');
    await waitFor(() => expect(suggestionsList[0]).toHaveAttribute('name', 'MIT'));
    await waitFor(() => expect(suggestionsList[0]).toHaveAttribute('uuid', 'a7d0e2c0-9a02-421b-93bf-d081339090cc'));
    await waitFor(() => expect(suggestionsList[0]).toHaveAttribute('item_text', 'Add New Collaborator'));
    await waitFor(() => expect(suggestionsList[0].url).not.toBeNull());
    // check that clearing suggestions...clears suggestions
    fireEvent.change(input, { target: { value: '' } });
    await waitFor(async () => expect(await screen.findAllByTestId('list-field-suggestion')).not.toBeInTheDocument());
  });

  it('gets no suggestions for short autocomplete', async () => {
    render(<ListField {...collaboratorDefaultProps} />);
    const input = await screen.getByRole('textbox');
    await userEvent.type(input, 'mi');
    // check that we get no suggestions for a query that is too short
    await waitFor(async () => expect(await screen.findAllByTestId('list-field-suggestion')).not.toBeInTheDocument());
  });

  it('updates selected item on form', async () => {
    render(<ListField {...collaboratorDefaultProps} />);
    const currentList = await screen.getAllByTestId('draggable-list-item');

    // we start with 3 members
    await waitFor(() => expect(currentList).toHaveLength(3));
    const input = await screen.getByRole('textbox');
    // open the suggestion list
    await userEvent.type(input, 'mit');
    // confirm that entering a member not in the list adds it
    fireEvent.click(await screen.getByText('MIT'));
    let updatedList = await screen.getAllByTestId('draggable-list-item');
    await waitFor(() => expect(updatedList).toHaveLength(4));
    // confirm that entering a member already in the list does NOT add it
    await userEvent.type(input, 'mit');
    // confirm that entering a member not in the list adds it
    fireEvent.click(await screen.getByText('MIT'));
    updatedList = await screen.getAllByTestId('draggable-list-item');
    await waitFor(() => expect(updatedList).toHaveLength(4));
  });

  it('adds the referred item to state when one is given', async () => {
    render(<ListField {...collaboratorReferredProps} />);

    const currentList = screen.getAllByTestId('mock-collaborator');
    const newItem = currentList[currentList.length - 1];
    await waitFor(() => expect(newItem).toHaveAttribute('name', 'I am a school'));
  });

  it.skip('correctly handles removing members of the item', () => {
    // TODO: convert to RTL
    const component = render(<ListField {...collaboratorDefaultProps} />);
    let collaborators = component.find('.mock-collaborator');
    expect(collaborators).toHaveLength(collaboratorInput.value.length);

    const firstCollaborator = component.state().currentList[0];
    // Petend we deleted the first collaborator
    const firstUuid = collaboratorInput.value[0].uuid;
    component.instance().handleRemove(firstUuid);

    // Verify that the onChange method has been called
    expect(collaboratorInput.onChange).toBeCalled();

    // Verify that the first collaborator has been removed
    component.update();
    collaborators = component.find('.mock-collaborator');
    expect(collaborators).toHaveLength(collaboratorInput.value.length - 1);

    const newFirstCollaborator = component.state().currentList[0];
    expect(firstCollaborator).not.toEqual(newFirstCollaborator);
  });

  it.skip('correctly handles reordering members', () => {
    // TODO: convert to RTL
    const component = render(<ListField {...collaboratorDefaultProps} />);
    // Find the first item.
    const firstItem = component.state().currentList[0].uuid;

    const result = {
      source: {
        index: 0,
      },
      destination: {
        index: 2,
      },
    };
    // Pretend we dragged the first item to the end.
    component.instance().onDragEnd(result);

    // Verify that the onChange method has been called
    expect(collaboratorInput.onChange).toBeCalled();

    // Verify that it is on the end.
    expect(firstItem).toEqual(component.state().currentList[2].uuid);
  });

  it.skip('does not re-order when dragged outside of the list', () => {
    // TODO: convert to RTL
    const component = render(<ListField {...collaboratorDefaultProps} />);
    // Find the first item.
    const firstItem = component.state().currentList[0].uuid;

    const result = {
      source: {
        index: 0,
      },
    };
    // Pretend we dragged the first item outside the list.
    component.instance().onDragEnd(result);

    // Verify that the onChange method has NOT been called
    expect(collaboratorInput.onChange).not.toBeCalled();
    expect(firstItem).toEqual(component.state().currentList[0].uuid);
  });

  it.skip('does not re-order when dragged to the same position', () => {
    // TODO: convert to RTL
    const component = render(<ListField {...collaboratorDefaultProps} />);
    // Find the first item.
    const firstItem = component.state().currentList[0].uuid;

    const result = {
      source: {
        index: 0,
      },
      destination: {
        index: 0,
      },
    };
    // Pretend we dragged the first item to their original position.
    component.instance().onDragEnd(result);
    // Verify that the onChange method has NOT been called
    expect(collaboratorInput.onChange).not.toBeCalled();
    expect(firstItem).toEqual(component.state().currentList[0].uuid);
  });
});

describe.skip('ListField - Staffers', () => {
  // TODO: Fix the commented out tests and re-enable this test suite.
  afterEach(() => {
    // Clear onChange's call count after each test
    stafferInput.onChange.mockClear();
    // reset api client response
    mockClient.reset();
  });

  it('renders a list of staff members and an autocomplete input', async () => {
    const { container } = render(<ListField {...staffDefaultProps} />);
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders correctly with referred props', async () => {
    const { container } = render(<ListField {...staffReferredProps} />);
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders correctly with an error after failed submission', async () => {
    const metaFailedProps = {

      ...staffDefaultProps,
      meta: {
        submitFailed: true,
        error: 'This field is required',
      },
    };
    const { container } = render(<ListField {...metaFailedProps} />);
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('gets/clears suggestions for autocomplete', async () => {
    mockClient.onGet('http://localhost:18381/api/v1/search/person_typeahead/?q=long&org=MITx')
      .replyOnce(200, JSON.stringify(mockAutoCompletePersonResponses.long));

    render(<ListField {...staffDefaultProps} owners={owners} />);
    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'long' } });
    // TODO: Verify uuid rendering
    // expect(suggestions[0].uuid).toEqual('a7d0e2c0-9a02-421b-93bf-d081339090cc');
    await waitFor(() => expect(screen.getByText('Longstocking')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Add New Instructor')).toBeInTheDocument());
    fireEvent.blur(input);
    await waitFor(() => expect(screen.queryByText('Longstocking')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Add New Instructor')).not.toBeInTheDocument());

    // TODO: Add clearing of suggestions
    // // check that clearing suggestions...clears suggestions
    //   component.instance().onSuggestionsClearRequested();
    //   ({ suggestions } = component.state());
    //   expect(suggestions.length).toEqual(0);
    //   // required because we are 'expect'ing inside of an async promise
    //   done();
    // });
  });

  it('gets no suggestions for short autocomplete', async () => {
    mockClient.onGet('http://localhost:18381/api/v1/search/person_typeahead/?q=long&org=MITx')
      .replyOnce(200, JSON.stringify(mockAutoCompletePersonResponses.long));

    render(<ListField {...staffDefaultProps} owners={owners} />);
    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'lo' } });
    // check that we get no suggestions for a query that is too short
    await waitFor(() => expect(screen.getByText('Longstocking')).not.toBeInTheDocument());
  });

  it.skip('updates selected staff on form', async () => {
    // TODO: update and enable
    // let { currentList } = component.state();
    // // we start with 3 staff members
    // expect(currentList.length).toEqual(3);
    // component.instance().onSuggestionEntered(
    //   null,
    //   { suggestion: mockAutoCompletePersonResponses.long[0] },
    // );
    // // confirm that entering a staff member not in the list adds it
    // ({ currentList } = component.state());
    // expect(currentList.length).toEqual(4);
    // // confirm that entering a staff member already in the list does NOT add it
    // component.instance().onSuggestionEntered(
    //   null,
    //   { suggestion: mockAutoCompletePersonResponses.long[0] },
    // );
    // expect(currentList.length).toEqual(4);
  });

  it.skip('correctly handles removing members of the staff', () => {
    // TODO: update and enable
    // const component = mount(<ListField {...staffDefaultProps} />);
    // let staffers = component.find('.mock-staffer');
    // expect(staffers).toHaveLength(stafferInput.value.length);
    //
    // const firstStaffer = component.state().currentList[0];
    // // Petend we deleted the first staffer
    // const firstUuid = stafferInput.value[0].uuid;
    // component.instance().handleRemove(firstUuid);
    //
    // // Verify that the onChange method has been called
    // expect(stafferInput.onChange).toBeCalled();
    //
    // // Verify that the first staffer has been removed
    // component.update();
    // staffers = component.find('.mock-staffer');
    // expect(staffers).toHaveLength(stafferInput.value.length - 1);
    //
    // const newFirstStaffer = component.state().currentList[0];
    // expect(firstStaffer).not.toEqual(newFirstStaffer);
  });

  it.skip('correctly handles reordering members of the staff', () => {
    // TODO: update and enable
  //   const component = mount(<ListField {...staffDefaultProps} />);
  //   // Find the first staffer.
  //   const firstStaffer = component.state().currentList[0].uuid;
  //
  //   const result = {
  //     source: {
  //       index: 0,
  //     },
  //     destination: {
  //       index: 2,
  //     },
  //   };
  //   // Pretend we dragged the first staffer to the end.
  //   component.instance().onDragEnd(result);
  //
  //   // Verify that the onChange method has been called
  //   expect(stafferInput.onChange).toBeCalled();
  //
  //   // Verify that it is on the end.
  //   expect(firstStaffer).toEqual(component.state().currentList[2].uuid);
  });

  it.skip('does not re-order when dragged outside of the list', () => {
    // TODO: update and enable
  //   const component = mount(<ListField {...staffDefaultProps} />);
  //   // Find the first staffer.
  //   const firstStaffer = component.state().currentList[0].uuid;
  //
  //   const result = {
  //     source: {
  //       index: 0,
  //     },
  //   };
  //   // Pretend we dragged the first staffer outside the list.
  //   component.instance().onDragEnd(result);
  //
  //   // Verify that the onChange method has NOT been called
  //   expect(stafferInput.onChange).not.toBeCalled();
  //   expect(firstStaffer).toEqual(component.state().currentList[0].uuid);
  });

  it.skip('does not re-order when dragged to the same position', () => {
    // TODO: update and enable
  //   const component = mount(<ListField {...staffDefaultProps} />);
  //   // Find the first staffer.
  //   const firstStaffer = component.state().currentList[0].uuid;
  //
  //   const result = {
  //     source: {
  //       index: 0,
  //     },
  //     destination: {
  //       index: 0,
  //     },
  //   };
  //   // Pretend we dragged the first staffer to their original position.
  //   component.instance().onDragEnd(result);
  //   // Verify that the onChange method has NOT been called
  //   expect(stafferInput.onChange).not.toBeCalled();
  //   expect(firstStaffer).toEqual(component.state().currentList[0].uuid);
  });

  it.skip('adds the referred staffer to state when one is given', () => {
    // TODO: update and enable
  //   const component = mount(<ListField {...staffReferredProps} />);
  //
  //   const { currentList } = component.state();
  //
  //   expect(currentList[currentList.length - 1]).toEqual(newStaffer);
  });
});
