import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {Home} from './Home';
import {store} from '../../redux/store';
import {useNavigation} from '@react-navigation/native';

function renderHomeScreen() {
  return render(
    <Provider store={store}>
      <Home />
    </Provider>,
  );
}
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));
describe('Home Screen', () => {
  const mockNavigate = jest.fn();
  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });
    jest.clearAllMocks();
  });
  test('should render start conversation text correctly', async () => {
    const {getByText} = renderHomeScreen();
    expect(
      getByText(/Start Conversations with your closed ones/i),
    ).toBeTruthy();
  });
  test('Should render add contact button', () => {
    const {getByLabelText} = renderHomeScreen();
    expect(getByLabelText('addContact')).toBeTruthy();
  });

  test('Should navigate to ContactScreen on pressing add contact button', () => {
    const {getByLabelText} = renderHomeScreen();
    fireEvent.press(getByLabelText('addContact'));
    expect(mockNavigate).toHaveBeenCalledWith('Contact');
  });

  test('Should render the home image properly', ()=>{
    const {getByLabelText} = renderHomeScreen();
    expect(getByLabelText('home-image')).toBeTruthy();
  });

});
