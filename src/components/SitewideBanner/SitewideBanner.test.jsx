import React from 'react';
import '@testing-library/jest-dom';
import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import Cookies from 'js-cookie';
import SitewideBanner from './index';

describe('SitewideBanner', () => {
  it('renders correctly when visible', () => {
    render(
      <SitewideBanner
        message="Dummy Message"
        type="success"
        dismissible
        cookieName="bannerCookie"
        cookieExpiryDays={7}
      />,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-success');
    expect(alert).toHaveTextContent('Dummy Message');

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('calls handleDismiss and sets cookie when dismissed', async () => {
    const setCookieMock = jest.spyOn(Cookies, 'set');
    render(
      <SitewideBanner
        message="This is a test message"
        type="warning"
        dismissible
        cookieName="bannerCookie"
        cookieExpiryDays={7}
      />,
    );
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    await waitFor(() => expect(screen.queryByText(/this is a test message/i)).not.toBeInTheDocument());
    await waitFor(() => expect(setCookieMock).toHaveBeenCalledWith('bannerCookie', 'true', { expires: 7 }));
    setCookieMock.mockRestore();
  });

  it('handles non-dismissible banner correctly', () => {
    render(
      <SitewideBanner message="Non-dismissible message" dismissible={false} />,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });
});
