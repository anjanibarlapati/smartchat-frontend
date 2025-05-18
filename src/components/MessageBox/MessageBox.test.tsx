import { render, screen } from '@testing-library/react-native';
import { MessageBox } from './MessageBox';


jest.mock('../../../assets/images/singleTick.png', () => 'singleTick');
jest.mock('../../../assets/images/doubleTick.png', () => 'doubleTick');
jest.mock('../../../assets/images/readTick.png', () => 'readTick');

describe('MessageBox Component Check', () => {

  it('Should render message and timestamp', () => {
    render(
      <MessageBox
        message="Hello, Mamatha!"
        timestamp="12:45 PM"
        status="sent"
        isSender={true}
      />
    );

    expect(screen.getByText('Hello, Mamatha!')).toBeTruthy();
    expect(screen.getByText('12:45 PM')).toBeTruthy();
  });

  it(' Should not render tick icon if isSender is false', () => {
    render(
      <MessageBox
        message="Hi!"
        timestamp="1:00 PM"
        status="read"
        isSender={false}
      />
    );

    expect(screen.queryByAccessibilityHint('sent-tick-icon')).toBeNull();
    expect(screen.queryByAccessibilityHint('delivered-tick-icon')).toBeNull();
    expect(screen.queryByAccessibilityHint('read-tick-icon')).toBeNull();
  });

  it('Should render single tick icon when status is "sent"', () => {
    render(
      <MessageBox
        message="Test Sent"
        timestamp="1:01 PM"
        status="sent"
        isSender={true}
      />
    );

    expect(screen.getByAccessibilityHint('sent-tick-icon')).toBeTruthy();
  });

  it('Should render double tick icon when status is "delivered"', () => {
    render(
      <MessageBox
        message="Test Delivered"
        timestamp="1:02 PM"
        status="delivered"
        isSender={true}
      />
    );

    expect(screen.getByAccessibilityHint('delivered-tick-icon')).toBeTruthy();
  });

  it('Should render read tick icon when status is "read"', () => {
    render(
      <MessageBox
        message="Test Read"
        timestamp="1:03 PM"
        status="read"
        isSender={true}
      />
    );

    expect(screen.getByAccessibilityHint('read-tick-icon')).toBeTruthy();
  });

});
