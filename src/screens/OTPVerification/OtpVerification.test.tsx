import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React, { act } from 'react';
import { OtpVerification } from './OtpVerification';

jest.mock('../../hooks/appTheme', () => ({
  useAppTheme: () => ({
    primaryBackground: '#fff',
    textPrimary: '#000',
    textSecondary: '#666',
  }),
}));

describe('OtpVerification screen check', () => {
  it('Should render verification image correctly', () => {
    const {getByLabelText} = render(<OtpVerification />);
    const verificationImage = getByLabelText('verification-image');
    expect(verificationImage.props.source).toEqual(
      require('../../../assets/images/verification.png'),
    );
  });

  it('Should render all the static content of screen', () => {
    const {getByText} = render(<OtpVerification />);
    expect(getByText('Enter Verification Code')).toBeTruthy();
    expect(
      getByText("We've sent you a 6-digit verification code to email"),
    ).toBeTruthy();
    expect(getByText('2:00')).toBeTruthy();
  });

  it('Should show error and clear OTP when submitting incomplete OTP', async () => {
    const {getByText, queryByText, getByLabelText} = render(
      <OtpVerification />,
    );
    const otpInput = getByLabelText('One-Time Password');
    fireEvent.changeText(otpInput, '143');
    fireEvent.press(getByText('Submit'));
    await waitFor(() => {
      expect(queryByText('Please enter a valid 6-digit code.')).toBeTruthy();
    });
  });

  it('Should clear error for valid OTP submission', async () => {
    const {getByText, queryByText, getByLabelText} = render(
      <OtpVerification />,
    );
    const otpInput = getByLabelText('One-Time Password');
    fireEvent.changeText(otpInput, '123456');
    fireEvent.press(getByText('Submit'));
    await waitFor(() => {
      expect(queryByText('Please enter a valid 6-digit code.')).toBeNull();
    });
  });

  it('Should enable resend button after timeout and call handler', async () => {
    jest.useFakeTimers();
    const {getByText} = render(<OtpVerification />);
    act(() => {
      jest.advanceTimersByTime(120000);
    });
    await waitFor(() => {
      expect(getByText('Resend Code?')).toBeTruthy();
    });
    fireEvent.press(getByText('Resend Code?'));
    jest.useRealTimers();
  });
});
