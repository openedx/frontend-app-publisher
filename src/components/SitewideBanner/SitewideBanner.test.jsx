import React from 'react';
import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import Cookies from 'js-cookie';
import SitewideBanner from './index';

describe('SitewideBanner', () => {
  it('renders correctly when visible', async () => {
    render(
      <SitewideBanner
        message="Dummy Message"
        type="success"
        dismissible
        cookieName="bannerCookie"
        cookieExpiryDays={7}
      />,
    );

    await waitFor(() => expect(screen.getByRole('alert')).toHaveClass('alert-success'));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveAttribute('data-dismissible', 'true'));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Dummy Message'));
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

  it('handles non-dismissible banner correctly', async () => {
    render(
      <SitewideBanner message="Non-dismissible message" dismissible={false} />,
    );
    await waitFor(() => expect(screen.getByRole('alert')).not.toHaveAttribute('data-dismissible', 'true'));
  });
});
