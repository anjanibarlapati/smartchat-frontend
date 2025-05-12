import React from 'react';
import {render} from '@testing-library/react-native';
import InputField from './InputField';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

const renderInputField = (value: string, placeholder: string, error?:string) => {
    return render(
        <Provider store={store}>
            <InputField value={value} placeholder={placeholder} onChangeText={() => {}} error={error}/>,
        </Provider>
    );
};

describe('Input Field Component', () => {
  it('Should render correctly with given placeholder', () => {
    const {getByPlaceholderText} = renderInputField('', 'First Name');
    expect(getByPlaceholderText('First Name')).toBeTruthy();
  });
  it('Should display an error message when error occurs', () => {
    const {getByText} = renderInputField('', 'Email', 'Email is required');
    expect(getByText('Email is required')).toBeTruthy();
  });
});
