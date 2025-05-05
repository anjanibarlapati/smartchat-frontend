import {render} from '@testing-library/react-native';
import React from 'react';
import InputField from './InputField';

describe('InputField Component', () => {
  it('renders correctly with given placeholder', () => {
    const {getByPlaceholderText} = render(
      <InputField value="" placeholder="First Name" onChangeText={() => {}} />,
    );
    expect(getByPlaceholderText('First Name')).toBeTruthy();
  });
  it('displays an error message when error occurs', () => {
    const {getByText} = render(
      <InputField
        value=""
        placeholder="Email"
        onChangeText={() => {}}
        error="Email is required"
      />,
    );
    expect(getByText('Email is required')).toBeTruthy();
  });
});
