import React from 'react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import {
  render, waitFor, screen, fireEvent, within,
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

describe('ListField - Collaborators', () => {
  afterEach(() => {
    // Clear onChange's call count after each test
    collaboratorInput.onChange.mockClear();
    // reset api client response
    mockClient.reset();
  });

  it('renders a list of item members and an autocomplete input', async () => {
    const { container } = render(<MemoryRouter><ListField {...collaboratorDefaultProps} /></MemoryRouter>);
    expect(container).toMatchSnapshot();

    const currentList = screen.getAllByTestId('draggable-list-item');
    await waitFor(() => expect(currentList).toHaveLength(3));
    const input = screen.getByRole('textbox');
    await waitFor(() => expect(input).toBeInTheDocument());
    await userEvent.type(input, 'mit');
    await waitFor(() => expect(screen.getByText('MIT')).toBeInTheDocument());
  });

  it('renders correctly with referred props', () => {
    const { container } = render(<MemoryRouter><ListField {...collaboratorReferredProps} /></MemoryRouter>);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with an error after failed submission', () => {
    const metaFailedProps = {
      ...collaboratorDefaultProps,
      meta: {
        submitFailed: true,
        error: 'This field is required',
      },
    };

    const { container } = render(<MemoryRouter><ListField {...metaFailedProps} /></MemoryRouter>);
    expect(container).toMatchSnapshot();
  });

  it('gets/clears suggestions for autocomplete', async () => {
    render(<MemoryRouter><ListField {...collaboratorDefaultProps} owners={owners} /></MemoryRouter>);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'mit');
    const suggestionsList = await screen.findAllByTestId('list-field-suggestion');
    expect(within(suggestionsList[0]).getByAltText(/logo for mit/i)).toBeInTheDocument();
    expect(within(suggestionsList[0]).getByText('MIT')).toBeInTheDocument();
    fireEvent.change(input, { target: { value: '' } });
    await waitFor(() => {
      expect(screen.queryByTestId('list-field-suggestion')).not.toBeInTheDocument();
    });
  });

  it('updates selected item on form', async () => {
    render(<MemoryRouter><ListField {...collaboratorDefaultProps} /></MemoryRouter>);
    const currentList = await screen.getAllByTestId('draggable-list-item');

    // we start with 3 members
    await waitFor(() => expect(currentList).toHaveLength(3));
    const input = screen.getByRole('textbox');
    // open the suggestion list
    await userEvent.type(input, 'mit');
    // confirm that entering a member not in the list adds it
    fireEvent.click(screen.getByText('MIT'));
    const updatedList = screen.getAllByTestId('draggable-list-item');
    await waitFor(() => expect(updatedList).toHaveLength(4));
  });

  it('adds the referred item to state when one is given', async () => {
    render(<MemoryRouter><ListField {...collaboratorReferredProps} /></MemoryRouter>);
    const listItems = await screen.findAllByTestId('draggable-list-item');
    const lastItem = listItems[listItems.length - 1];
    expect(lastItem).toHaveTextContent('I am a school');
  });

  it('gets no suggestions for short autocomplete', async () => {
    render(<MemoryRouter><ListField {...collaboratorDefaultProps} /></MemoryRouter>);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'mi');
    // check that we get no suggestions for a query that is too short
    await waitFor(() => expect(screen.queryByTestId('list-field-suggestion')).not.toBeInTheDocument());
  });

  it('correctly handles removing members of the item', async () => {
    jest.resetModules();
    jest.unmock('../Collaborator');
    render(
      <MemoryRouter>
        <ListField {...collaboratorDefaultProps} />
      </MemoryRouter>,
    );
    const collaboratorSectionEntry = screen.getByText('Waseda').closest('.staffer-details');
    expect(collaboratorSectionEntry).toBeInTheDocument();
    const deleteButton = within(collaboratorSectionEntry).getByRole('button', {
      name: /remove waseda/i,
    });

    await userEvent.click(deleteButton);
    expect(screen.queryByText('Waseda')).not.toBeInTheDocument();
  });
});

describe('ListField - Staffers', () => {
  afterEach(() => {
    // Clear onChange's call count after each test
    stafferInput.onChange.mockClear();
    // reset api client response
    mockClient.reset();
  });

  it('renders a list of staff members', async () => {
    const { container } = render(<MemoryRouter><ListField {...staffDefaultProps} owners={owners} /></MemoryRouter>);
    expect(container).toMatchSnapshot();
    const currentList = screen.getAllByTestId('draggable-list-item');
    await waitFor(() => expect(currentList).toHaveLength(3));
  });

  it('renders correctly with referred props', () => {
    const { container } = render(<MemoryRouter><ListField {...staffReferredProps} owners={owners} /></MemoryRouter>);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with an error after failed submission', () => {
    const metaFailedProps = {

      ...staffDefaultProps,
      meta: {
        submitFailed: true,
        error: 'This field is required',
      },
    };
    const { container } = render(<MemoryRouter><ListField {...metaFailedProps} /></MemoryRouter>);
    expect(container).toMatchSnapshot();
  });

  it('gets/clears suggestions for autocomplete', async () => {
    mockClient.onGet('http://localhost:18381/api/v1/search/person_typeahead/?q=long&org=MITx')
      .replyOnce(200, JSON.stringify(mockAutoCompletePersonResponses.long));

    render(<MemoryRouter><ListField {...staffDefaultProps} owners={owners} /></MemoryRouter>);
    const input = await screen.findByRole('textbox');
    const comboBox = screen.getByRole('combobox');
    expect(comboBox.getAttribute('aria-expanded')).toBe('false');
    fireEvent.change(input, { target: { value: 'long' } });
    await waitFor(() => expect(comboBox.getAttribute('aria-expanded')).toBe('true'));
    await waitFor(() => expect(screen.getByAltText('profile for Pippi Longstocking')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Pippi Longstocking')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Add New Instructor')).toBeInTheDocument());

    fireEvent.blur(input);
    await waitFor(() => expect(screen.queryByText('Longstocking')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Add New Instructor')).not.toBeInTheDocument());
    await waitFor(() => expect(comboBox.getAttribute('aria-expanded')).toBe('false'));
  });

  it('gets no suggestions for short autocomplete', async () => {
    mockClient.onGet('http://localhost:18381/api/v1/search/person_typeahead/?q=long&org=MITx')
      .replyOnce(200, JSON.stringify(mockAutoCompletePersonResponses.long));

    render(<MemoryRouter><ListField {...staffDefaultProps} owners={owners} /></MemoryRouter>);
    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'lo' } });
    // check that we get no suggestions for a query that is too short
    await waitFor(() => expect(screen.queryByText('Longstocking')).not.toBeInTheDocument());
  });

  it('updates selected staff on form', async () => {
    mockClient.onGet('http://localhost:18381/api/v1/search/person_typeahead/?q=long&org=MITx')
      .replyOnce(200, JSON.stringify(mockAutoCompletePersonResponses.long));
    mockClient.onGet('http://localhost:18381/api/v1/search/person_typeahead/?q=Pippi Longstocking&org=MITx')
      .replyOnce(200, JSON.stringify(mockAutoCompletePersonResponses.long));

    render(<MemoryRouter><ListField {...staffDefaultProps} owners={owners} /></MemoryRouter>);
    const currentList = await screen.getAllByTestId('draggable-list-item');
    await waitFor(() => expect(currentList).toHaveLength(3));
    const input = await screen.findByRole('textbox');
    const comboBox = await screen.findByRole('combobox');
    fireEvent.change(input, { target: { value: 'long' } });
    await waitFor(() => expect(comboBox.getAttribute('aria-expanded')).toBe('true'));
    const listbox = screen.getAllByRole('listbox')[1];
    const option = within(listbox).getByText('Pippi Longstocking');
    await userEvent.click(option);
    // Check that the new staff member has been added
    const updatedList = await screen.getAllByTestId('draggable-list-item');
    await waitFor(() => expect(updatedList).toHaveLength(4));
  });

  it('correctly handles removing members of the staff', async () => {
    render(
      <MemoryRouter>
        <ListField {...staffDefaultProps} owners={owners} />
      </MemoryRouter>,
    );

    const staffListItem = screen.getByText('Dave Grohl').closest('.staffer-details');
    expect(staffListItem).toBeInTheDocument();

    const deleteIcon = staffListItem.querySelector('#delete-icon-2aba6189-ad7e-45a8-b269-bea071b80391');
    const deleteButton = deleteIcon.closest('button');
    await userEvent.click(deleteButton);
    expect(screen.queryByText('Dave Grohl')).not.toBeInTheDocument();
  });

  it('adds the referred staffer to state when one is given', async () => {
    render(<MemoryRouter><ListField {...staffReferredProps} /></MemoryRouter>);

    const listItems = await screen.findAllByTestId('draggable-list-item');
    // Check that the last list item includes the referred staffer's name
    const lastItem = listItems[listItems.length - 1];
    expect(lastItem).toHaveTextContent('Person McPerson');
  });
});
