import { render } from '@testing-library/react';
import { getUrlSlugHelp, oldUrlSlugExample, subdirectoryUrlSlugExample } from './helpText';

describe('urlSlugHelp', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // it clears the cache
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('renders the old URL slug example when IS_NEW_SLUG_FORMAT_ENABLED is false', () => {
    const { container } = render(getUrlSlugHelp(process.env.IS_NEW_SLUG_FORMAT_ENABLED));
    const text = container.querySelectorAll('p')[6].textContent;
    expect(text).toContain(oldUrlSlugExample.props.children);
  });

  it('renders the subdirectory URL slug example when IS_NEW_SLUG_FORMAT_ENABLED is true', () => {
    process.env.IS_NEW_SLUG_FORMAT_ENABLED = 'true';
    const { container } = render(getUrlSlugHelp(process.env.IS_NEW_SLUG_FORMAT_ENABLED));
    const text = container.querySelectorAll('p')[6].textContent;
    expect(text).toContain(subdirectoryUrlSlugExample.props.children);
  });
});
