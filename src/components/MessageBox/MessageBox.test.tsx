import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { MessageProps } from '../../types/MessageProps';
import { MessageBox } from './MessageBox';
import { MessageStatus } from '../../types/message';

const renderMessageBox = ({
  message = '',
  timestamp = '',
  status = MessageStatus.SENT,
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
      status: MessageStatus.SENT,
      isSender: true,
    });

    expect(screen.getByText('Hello, Mamatha!')).toBeTruthy();
    expect(screen.getByText('12:45 PM')).toBeTruthy();
  });

  it('Should not render tick icon if isSender is false', () => {
    renderMessageBox({
      message: 'Hi!',
      timestamp: '1:00 PM',
      status: MessageStatus.SEEN,
      isSender: false,
    });

    expect(screen.queryByLabelText('sent-tick-icon')).toBeNull();
    expect(screen.queryByLabelText('delivered-tick-icon')).toBeNull();
    expect(screen.queryByLabelText('read-tick-icon')).toBeNull();
    expect(screen.queryByLabelText('pending-tick-icon')).toBeNull();
  });

  it('Should render single tick icon when status is "sent"', () => {
    renderMessageBox({
      message: 'Test Sent',
      timestamp: '1:01 PM',
      status: MessageStatus.SENT,
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
      status: MessageStatus.DELIVERED,
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
      status: MessageStatus.SEEN,
      isSender: true,
    });

    expect(screen.getByLabelText('tick-icon').props.source).toEqual(
      require('../../../assets/images/readTick.png'),
    );
  });
  it('Should render pending icon when status is "pending"', () => {
    renderMessageBox({
      message: 'Test pending',
      timestamp: '1:03 PM',
      status: MessageStatus.PENDING,
      isSender: true,
    });

    expect(screen.getByLabelText('tick-icon').props.source).toEqual(
      require('../../../assets/images/pending.png'),
    );
  });
  it('Should apply styles based on the width of the screen', async () => {
    const {getByLabelText} = renderMessageBox({
      message: 'Hello, Mamatha!',
      timestamp: '12:45 PM',
      status: MessageStatus.SENT,
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
      status: MessageStatus.SENT,
      isSender: true,
    });
    const messageBoxContainerr = screen.getByLabelText(
      'messageBox-container',
    ).parent;
    expect(messageBoxContainerr?.props.style[0].maxWidth).toBe('80%');
  });
});
