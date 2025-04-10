/* eslint-disable import/no-extraneous-dependencies */

import 'regenerator-runtime/runtime';
import axios from 'axios';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { getAuthenticatedHttpClient, getAuthenticatedUser } from '@edx/frontend-platform/auth';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('@edx/frontend-platform/auth');
getAuthenticatedHttpClient.mockReturnValue(axios);
getAuthenticatedUser.mockReturnValue({ administrator: false });

process.env.COURSE_URL_SLUGS_PATTERN = `{
    "edx": {
        "default": {
            "slug_format": "^learn/[a-z0-9_]+(?:-?[a-z0-9_]+)*/[a-z0-9_]+(?:-?[a-z0-9_]+)*$|^[a-z0-9_]+(?:-[a-z0-9_]+)*$",
            "error_msg": "Course URL slug contains lowercase letters, numbers, underscores, and dashes only and must be in the format <custom-url-slug> or learn/<primary_subject>/<org-slug>-<course_slug>."
        }
    },
    "external-source": {
        "default": {
            "slug_format": "^[a-z0-9_]+(?:-[a-z0-9_]+)*$",
            "error_msg": "Course URL slug contains lowercase letters, numbers, underscores, and dashes only."
        },
        "executive-education-2u": {
            "slug_format": "^executive-education/[a-z0-9_]+(?:-?[a-z0-9_]+)*$|^[a-z0-9_]+(?:-[a-z0-9_]+)*$",
            "error_msg": "Course URL slug contains lowercase letters, numbers, underscores, and dashes only and must be in the format <custom-url-slug> or executive-education/<org-slug>-<course_slug>."
        }
    }
}`;

// We need this here because tinymce uses a method(s) which JSDOM has not
// implemented yet. To fix this, the following mocks matchMedia so that all tests
// execute properly. More info here:
// https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Disable all react-beautiful-dnd development warnings.
// See https://github.com/atlassian/react-beautiful-dnd/issues/1593
window['__react-beautiful-dnd-disable-dev-warnings'] = true;
