import { shallow } from 'enzyme';
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
    const wrapper = shallow(getUrlSlugHelp(process.env.IS_NEW_SLUG_FORMAT_ENABLED));
    const example = wrapper.find('p').at(6).text();

    expect(example).toContain(oldUrlSlugExample.props.children);
  });

  it('renders the subdirectory URL slug example when IS_NEW_SLUG_FORMAT_ENABLED is true', () => {
    process.env.IS_NEW_SLUG_FORMAT_ENABLED = 'true';

    const wrapper = shallow(getUrlSlugHelp(process.env.IS_NEW_SLUG_FORMAT_ENABLED));
    const example = wrapper.find('p').at(6).text();

    expect(example).toContain(subdirectoryUrlSlugExample.props.children);
  });
});
