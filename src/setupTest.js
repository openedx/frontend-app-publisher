/* eslint-disable import/no-extraneous-dependencies */

import 'regenerator-runtime/runtime';
import axios from 'axios';
import { getAuthenticatedHttpClient, getAuthenticatedUser } from '@edx/frontend-platform/auth';

jest.mock('@edx/frontend-platform/auth');
getAuthenticatedHttpClient.mockReturnValue(axios);
getAuthenticatedUser.mockReturnValue({ administrator: false });

// https://github.com/wwayne/react-tooltip/issues/595#issuecomment-638438372
jest.mock('react-tooltip/node_modules/uuid', () => ({
  v4: () => '00000000-0000-0000-0000-000000000000',
}));

// uuid is used to generate id for editor. During tests, if not mocked, every new run will have
// different uuid and thus, snapsots will change.
// This mocking is inspired from https://github.com/jpuri/react-draft-wysiwyg/issues/780
// TODO: Since uuid is used for id, it might not be a good idea to hardcode same id on same page.
jest.mock('@tinymce/tinymce-react/lib/cjs/main/ts/Utils', () => ({
  ...jest.requireActual('@tinymce/tinymce-react/lib/cjs/main/ts/Utils'),
  uuid: () => '00000000-0000-0000-0000-000000000000',
}));

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
