import { fireEvent, render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { AlertModal } from './AlertModal';

const renderAlertModal = ({
  visible = true,
  message = 'Do you really want to delete this account?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
} = {}) => {
  return render(
    <Provider store={store}>
      <AlertModal
        visible={visible}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </Provider>,
  );
};

describe('Alert Modal', () => {
  it('Should render the modal with given message and buttons ', () => {
    const {getByText} = renderAlertModal();
    expect(
      getByText('Do you really want to delete this account?'),
    ).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('Should trigger onConfirm when confirm button is pressed', () => {
    const handleConfirm = jest.fn();

    const {getByText} = renderAlertModal({onConfirm: handleConfirm});

    fireEvent.press(getByText('Delete'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('Should trigger onCancel when cancel button is pressed', () => {
    const handleCancel = jest.fn();

    const {getByText} = renderAlertModal({onCancel: handleCancel});

    fireEvent.press(getByText('Cancel'));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
  it('Should apply styles based on the width of the screen', () => {
    const {getByText} = renderAlertModal();
    const modalContainer = getByText(
      ' Do you really want to delete this account?',
    ).parent?.parent;
    expect(modalContainer?.props.style.width).toBe('50%');
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({width: 200, height: 100});
    renderAlertModal();
    const smallScreenModalContainer = screen.getByText(
      ' Do you really want to delete this account?',
    ).parent?.parent;
    expect(smallScreenModalContainer?.props.style.width).toBe('78%');
  });
});
