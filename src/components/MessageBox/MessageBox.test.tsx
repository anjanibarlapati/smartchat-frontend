import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react-native';
import { store } from '../../redux/store';
import { MessageProps } from '../../types/MessageProps';
import { MessageBox } from './MessageBox';

const renderMessageBox = ({
  message = '',
  timestamp = '',
  status = 'sent',
  isSender = false,
}: Partial<MessageProps> = {}) => {
  return render(
    <Provider store={store}>
      <MessageBox
        message={message}
        timestamp={timestamp}
        status={status}
        isSender={isSender}
      />
    </Provider>,
  );
};

describe('MessageBox Component Check', () => {
  it('Should render message and timestamp', () => {
    renderMessageBox({
      message: 'Hello, Mamatha!',
      timestamp: '12:45 PM',
      status: 'sent',
      isSender: true,
    });

    expect(screen.getByText('Hello, Mamatha!')).toBeTruthy();
    expect(screen.getByText('12:45 PM')).toBeTruthy();
  });

  it('Should not render tick icon if isSender is false', () => {
    renderMessageBox({
      message: 'Hi!',
      timestamp: '1:00 PM',
      status: 'seen',
      isSender: false,
    });

    expect(screen.queryByLabelText('sent-tick-icon')).toBeNull();
    expect(screen.queryByLabelText('delivered-tick-icon')).toBeNull();
    expect(screen.queryByLabelText('read-tick-icon')).toBeNull();
  });

  it('Should render single tick icon when status is "sent"', () => {
    renderMessageBox({
      message: 'Test Sent',
      timestamp: '1:01 PM',
      status: 'sent',
      isSender: true,
    });

    expect(screen.getByLabelText('tick-icon').props.source).toEqual(
      require('../../../assets/images/singleTick.png'),
    );
  });

  it('Should render double tick icon when status is "delivered"', () => {
    renderMessageBox({
      message: 'Test Delivered',
      timestamp: '1:02 PM',
      status: 'delivered',
      isSender: true,
    });

    expect(screen.getByLabelText('tick-icon').props.source).toEqual(
      require('../../../assets/images/doubleTick.png'),
    );
  });

  it('Should render read tick icon when status is "seen"', () => {
    renderMessageBox({
      message: 'Test Seen',
      timestamp: '1:03 PM',
      status: 'seen',
      isSender: true,
    });

    expect(screen.getByLabelText('tick-icon').props.source).toEqual(
      require('../../../assets/images/readTick.png'),
    );
  });
  it('Should apply styles based on the width of the screen', async () => {
    const {getByLabelText} = renderMessageBox({
      message: 'Hello, Mamatha!',
      timestamp: '12:45 PM',
      status: 'sent',
      isSender: true,
    });
    const messageBoxContainer = getByLabelText('messageBox-container').parent;
    expect(messageBoxContainer?.props.style[0].maxWidth).toBe('55%');
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({width: 10, height: 100});
    renderMessageBox({
      message: 'Hello, Mamatha!',
      timestamp: '12:45 PM',
      status: 'sent',
      isSender: true,
    });
    const messageBoxContainerr = screen.getByLabelText(
      'messageBox-container',
    ).parent;
    expect(messageBoxContainerr?.props.style[0].maxWidth).toBe('80%');
  });
});
