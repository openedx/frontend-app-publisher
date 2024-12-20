import React from 'react';
import { shallow } from 'enzyme';
import Cookies from 'js-cookie';
import { Alert } from 'react-bootstrap';
import SitewideBanner from './index';

describe('SitewideBanner', () => {
  it('renders correctly when visible', () => {
    const wrapper = shallow(
      <SitewideBanner
        message="Dummy Message"
        type="success"
        dismissible
        cookieName="bannerCookie"
        cookieExpiryDays={7}
      />,
    );

    expect(wrapper.find(Alert).props().variant).toBe('success');
    expect(wrapper.find(Alert).props().dismissible).toBe(true);
    const alertContent = wrapper.find(Alert)
      .dive()
      .find('div')
      .first()
      .html();
    expect(alertContent).toContain('Dummy Message');
  });

  it('calls handleDismiss and sets cookie when dismissed', () => {
    const setCookieMock = jest.spyOn(Cookies, 'set');
    const wrapper = shallow(
      <SitewideBanner
        message="This is a test message"
        type="warning"
        dismissible
        cookieName="bannerCookie"
        cookieExpiryDays={7}
      />,
    );
    wrapper.find(Alert).simulate('close');
    expect(wrapper.isEmptyRender()).toBe(true);
    expect(setCookieMock).toHaveBeenCalledWith('bannerCookie', 'true', {
      expires: 7,
    });
    setCookieMock.mockRestore();
  });

  it('handles non-dismissible banner correctly', () => {
    const wrapper = shallow(
      <SitewideBanner message="Non-dismissible message" dismissible={false} />,
    );
    expect(wrapper.find(Alert).props().dismissible).toBe(false);
  });
});
