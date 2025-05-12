import {fireEvent, render} from '@testing-library/react-native';
import './Contact';
import {Contact} from './Contact';
import {store} from '../../redux/store';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';

const renderContactScreen = () => {
  return render(
    <Provider store={store}>
      <NavigationContainer>
        <Contact />
      </NavigationContainer>
    </Provider>,
  );
};
describe('Check for Contacts Screen', () => {
  it('Should check if the header has title as "Select contact"', () => {
    const {getByText} = renderContactScreen();
    expect(getByText('Contacts on SmartChat')).toBeTruthy();
    expect(getByText('Invite to SmartChat')).toBeTruthy();
  });
  it('Should switch tabs correctly', () => {
    const {getByText} = renderContactScreen();
    const inviteTab = getByText('Invite to SmartChat');
    fireEvent.press(inviteTab);
    expect(getByText('Invite to SmartChat')).toBeTruthy();
  });
  it('switches tab back to "Contacts on SmartChat" when clicked', () => {
    const {getByText} = renderContactScreen();

    fireEvent.press(getByText('Invite to SmartChat'));
    fireEvent.press(getByText('Contacts on SmartChat'));

    expect(getByText('Contacts on SmartChat')).toBeTruthy();
  });
});
