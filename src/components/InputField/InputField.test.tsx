import React from 'react';
import {render, screen} from '@testing-library/react-native';
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

  it('Should render required field placeholder correctly', () => {
    const {getByPlaceholderText} = render(
        <Provider store={store}>
            <InputField value="" placeholder="First Name" onChangeText={() => {}} required/>,
        </Provider>
    );
    expect(getByPlaceholderText('First Name *')).toBeTruthy();
  });

  it('Should display an error message when error occurs', () => {
    const {getByText} = renderInputField('', 'Email', 'Email is required');
    expect(getByText('Email is required')).toBeTruthy();
  });

  it('Should apply styles based on the width of the screen', async () => {
      const {getByPlaceholderText} = renderInputField('', 'First Name');
      const placeHolder = getByPlaceholderText('First Name');
      expect(placeHolder?.props.style.fontSize).toBe(16);
      jest
        .spyOn(require('react-native'), 'useWindowDimensions')
        .mockReturnValue({width: 10, height: 100});
      renderInputField('', 'First Name');
      const placeHolderContainer = screen.getByPlaceholderText('First Name').parent;
      expect(placeHolderContainer?.props.style.fontSize).toBe(14);
    });
});
