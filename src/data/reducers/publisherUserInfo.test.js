import publisherUserInfo from './publisherUserInfo';
import * as actions from '../actions/publisherUserInfo';

describe('publisherUserInfo reducer', () => {
  const oldState = { // overwritten as old state for actions
    isFetching: true,
    error: 'error occurred',
    organizations: [],
  };

  it('initial state is valid', () => {
    expect(publisherUserInfo(undefined, {})).toEqual({
      organizations: [],
      isFetching: true,
      error: null,
    });
  });

  it('request organizations started', () => {
    expect(publisherUserInfo(oldState, actions.requestUserOrganizations()))
      .toEqual({
        organizations: [],
        isFetching: true,
        error: null,
      });
  });

  it('request organizations failed', () => {
    expect(publisherUserInfo(oldState, actions.requestUserOrganizationsFail('failed')))
      .toEqual({
        organizations: [],
        isFetching: false,
        error: 'failed',
      });
  });

  it('request organizations success', () => {
    const organizations = [
      {
        uuid: '4c30506c-4150-4243-90a1-4e62f1ce3718',
        key: 'edx',
        name: 'edx',
        certificate_logo_image_url: null,
        description: '',
        homepage_url: null,
        tags: [],
        logo_image_url: null,
        marketing_url: null,
      },
      {
        uuid: '4c30506c-4150-4243-90a1-4e62f1123456',
        key: 'edx2',
        name: 'edx2',
        certificate_logo_image_url: null,
        description: '',
        homepage_url: null,
        tags: [],
        logo_image_url: null,
        marketing_url: null,
      },
    ];
    expect(publisherUserInfo(oldState, actions.requestUserOrganizationsSuccess(organizations)))
      .toEqual({
        organizations,
        isFetching: false,
        error: null,
      });
  });
});
