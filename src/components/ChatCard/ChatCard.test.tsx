import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react-native';
import { realmConfig, RealmResetProvider } from '../../contexts/RealmContext';
import { store } from '../../redux/store';
import { ChatCardProps } from '../../types/Chat';
import { ChatCard } from './ChatCard';
import { MessageStatus } from '../../types/message';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../MessageBox/MessageBox', () => ({
  getTickIcon: () => 'tick-icon.png',
}));

const chatDetails: ChatCardProps = {
  contact: {
    name: 'Rekha Korepu',
    originalNumber: '9876543210',
    mobileNumber: '1234567890',
    profilePicture: '/profileImage.png',
  },
  message: {
    message: 'How are you?',
    sentAt: new Date().toISOString(),
    isSender: true,
    status: MessageStatus.DELIVERED,
  },
  unreadCount: 2,
};

const renderChatCard = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
     <RealmResetProvider {...realmConfig}>{ui}</RealmResetProvider>
    </Provider>
  );
};

describe('ChatCard Component', () => {
  test('Should render name, message, timestamp, and profile image', () => {
    const { getByText, getByLabelText } = renderChatCard(<ChatCard {...chatDetails} />);

    expect(getByText(chatDetails.contact.name)).toBeTruthy();
    expect(getByText(chatDetails.message.message)).toBeTruthy();
    expect(getByLabelText('profile-image').props.source).toEqual({
      uri: chatDetails.contact.profilePicture,
    });
  });
  test('Should appends (You) to contact name when contact is current user', () => {
    const { getByText } = renderChatCard(
      <ChatCard
        {...chatDetails}
        contact={{
          ...chatDetails.contact,
          mobileNumber: '',
        }}
      />
    );
    expect(getByText(`${chatDetails.contact.name} (You)`)).toBeTruthy();
  });

  test('Should show unread badge when unreadCount is greater than 0', () => {
    const { getByText } = renderChatCard(<ChatCard {...chatDetails} />);
    expect(getByText(String(chatDetails.unreadCount))).toBeTruthy();
  });

  test('Should not show unread badge when unreadCount not provided', () => {
    const props: ChatCardProps = {
        contact: {
          name: 'Rekha Korepu',
          originalNumber: '9876543210',
          mobileNumber: '1234567890',
          profilePicture: '/profileImage.png',
        },
        message: {
          message: 'How are you?',
          sentAt: new Date().toISOString(),
          isSender: true,
          status: MessageStatus.DELIVERED,
        },
    };
    const { queryByText } = renderChatCard(<ChatCard {...props} />);
    expect(queryByText('0')).toBeNull();
  });

  test('Should not show unread badge when unreadCount is 0', () => {
    const props: ChatCardProps = {
      ...chatDetails,
      unreadCount:0,
    };
    const { queryByText } = renderChatCard(<ChatCard {...props} />);
    expect(queryByText('0')).toBeNull();
  });

  test('Should renders default profile image when profilePicture is null', () => {
    const props: ChatCardProps = {
      ...chatDetails,
      contact: {
        ...chatDetails.contact,
        profilePicture: null,
      },
    };
    const { getByLabelText } = renderChatCard(<ChatCard {...props} />);
    expect(getByLabelText('profile-image').props.source).toEqual(
      require('../../../assets/images/profileImage.png')
    );
  });

  test('Should render tick icon for sent message', () => {
    const props: ChatCardProps = {
      ...chatDetails,
      message: {
        ...chatDetails.message,
        isSender: true,
      },
    };
    const { getByLabelText } = renderChatCard(<ChatCard {...props} />);
    expect(getByLabelText('tick-icon')).toBeTruthy();
  });

  test('Should not render tick icon for received message', () => {
    const props: ChatCardProps = {
      ...chatDetails,
      message: {
        ...chatDetails.message,
        isSender: false,
      },
    };
    const { queryByLabelText } = renderChatCard(<ChatCard {...props} />);
    expect(queryByLabelText('tick-icon')).toBeNull();
  });

    test('Should navigate to IndividualChat screen on pressing on the chat card', () => {
    const { getByText } = renderChatCard(<ChatCard {...chatDetails} />);
    fireEvent.press(getByText('Rekha Korepu'));

    expect(mockNavigate).toHaveBeenCalledWith('IndividualChat', {
      name: chatDetails.contact.name,
      originalNumber: chatDetails.contact.originalNumber,
      mobileNumber: chatDetails.contact.mobileNumber,
      profilePic: chatDetails.contact.profilePicture,
    });
  });
});
