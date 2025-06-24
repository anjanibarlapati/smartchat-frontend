import React from 'react';
import { render } from '@testing-library/react-native';
import { OtpVerification } from './OtpVerification';


describe('OtpVerification', () => {
  it('should display incorrect text (this test is expected to fail)', () => {
    const { getByText } = render(<OtpVerification/>);
    getByText('Wrong Text');
  });
});
