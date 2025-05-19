import { IndividualChat } from './IndividualChat';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { render, screen } from '@testing-library/react-native';




jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

describe('IndividualChat', () => {
  beforeEach(() => {
    const setOptionsMock = jest.fn();

    const getParentMock = jest.fn().mockReturnValue({
      setOptions: setOptionsMock,
    });

    (useNavigation as jest.Mock).mockReturnValue({
      goBack: jest.fn(),
      setOptions: setOptionsMock,
      getParent: getParentMock,
    });

    (useRoute as jest.Mock).mockReturnValue({
      params: {
        name: 'Shailu',
        mobileNumber: '+91 9392345627',
        profilePic: 'pic-url',
      },
    });
  });

  test('should render the InputChatBox', () => {
    render(
      <NavigationContainer>
        <Provider store={store}>
          <IndividualChat />
        </Provider>
      </NavigationContainer>
    );

    const inputChatBox = screen.getByPlaceholderText('Type a message');
    expect(inputChatBox).toBeTruthy();
  });

  test('should render the menu icon', () => {
    render(
      <NavigationContainer>
        <Provider store={store}>
          <IndividualChat />
        </Provider>
      </NavigationContainer>
    );

    const menuIcon = screen.getByLabelText('send-icon');
    expect(menuIcon).toBeTruthy();
  });

  test('should call setOptions on navigation', () => {
    render(
      <NavigationContainer>
        <Provider store={store}>
          <IndividualChat />
        </Provider>
      </NavigationContainer>
    );

    const navigation = useNavigation();
    expect(navigation.setOptions).toHaveBeenCalledTimes(2);
  });

});
