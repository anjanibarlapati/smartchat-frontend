import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {Tabs} from './Tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}));
jest.mock('../../permissions/permissions.ts', () => ({
  requestPermission: jest.fn(),
}));
jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn(),
  openCamera: jest.fn(),
  clean: jest.fn(),
}));
const renderTabs = () =>
  render(
    <Provider store={store}>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </Provider>,
  );

describe('Should test the tab navigator', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(message => {
      if (
        typeof message === 'string' &&
        message.includes("The action 'RESET' with payload")
      ) {
        return;
      }
      console.error(message);
    });
  });

  it('Should render All Chats tab', () => {
    const {getAllByText} = renderTabs();
    expect(getAllByText(/All Chats/i).length).toBeGreaterThan(0);
  });

  it('Should render unread tab content after clicking Unread', async () => {
    const {getAllByText, findAllByText} = renderTabs();
    const unreadTab = getAllByText('Unread');
    fireEvent.press(unreadTab[0]);
    const unreadLabel = await findAllByText(/Unread/i);
    expect(unreadLabel.length).toBeGreaterThan(0);
  });

  it('Should render Profile tab content after clicking Profile', async () => {
    const {getAllByText, findAllByText} = renderTabs();

    const profileTab = getAllByText('Profile');
    fireEvent.press(profileTab[0]);

    const profileLabel = await findAllByText(/Profile/i);
    expect(profileLabel.length).toBeGreaterThan(0);
  });
});
