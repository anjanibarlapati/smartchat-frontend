import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { AlertType } from '../../types/AlertType';
import { CustomizableAlert } from './CustomizableAlert';

describe('Tests related to CustomizabeAlert modal', () => {
  const renderCustomizableAlertModal = (
    visible: boolean,
    message: string,
    type: AlertType = 'info',
    onClose = () => {},
  ) => {
    return render(
      <Provider store={store}>
        <CustomizableAlert
          visible={visible}
          message={message}
          onClose={onClose}
          type={type}
        />
      </Provider>,
    );
  };

  it('Should check for the elements in the Customizable Alert modal', () => {
    renderCustomizableAlertModal(true, 'Low connection');
    expect(screen.getByText('Low connection')).toBeTruthy();
    expect(screen.getByLabelText('Icon-Image')).toBeTruthy();
    expect(screen.getByText('OK')).toBeTruthy();
    expect(screen.getByLabelText('Icon-Image').props.source).toEqual(
      require('../../../assets/icons/info.png'),
    );
  });

  it('Should displays the error alert', () => {
    renderCustomizableAlertModal(true, 'Something went wrong', 'error');
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByLabelText('Icon-Image').props.source).toEqual(
      require('../../../assets/icons/error.png'),
    );
  });

  it('Should displays the success alert', () => {
    renderCustomizableAlertModal(true, 'Successfully registered', 'success');
    expect(screen.getByText('Successfully registered')).toBeTruthy();
    expect(screen.getByLabelText('Icon-Image').props.source).toEqual(
      require('../../../assets/icons/success.png'),
    );
  });

  it('Should displays the warning alert', () => {
    renderCustomizableAlertModal(true, 'User not found', 'warning');
    expect(screen.getByText('User not found')).toBeTruthy();
    expect(screen.getByLabelText('Icon-Image').props.source).toEqual(
      require('../../../assets/icons/warning.png'),
    );
  });
});
