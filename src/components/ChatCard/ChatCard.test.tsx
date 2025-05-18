import {render} from '@testing-library/react-native';
import {ChatCardProps} from '../../types/Chat';
import {ChatCard} from './ChatCard';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';

const renderChatCard = (chatList: ChatCardProps) => {
  return render(
    <Provider store={store}>
      <ChatCard
        name={chatList.name}
        message={chatList.message}
        time={chatList.time}
        unreadCount={chatList.unreadCount}
        profileImage={chatList.profileImage}
      />
    </Provider>
  );
};
const chat: ChatCardProps = {
  name: 'Rekha Korepu',
  message: 'How are you?',
  time: '15/05/25',
  unreadCount: 2,
  profileImage: '/profileImage.png',
};

describe('Chat Card Component', () => {
  test('should render the elements correctly', () => {
    const {getByLabelText, getByText} = renderChatCard(chat);
    expect(getByText(chat.name)).toBeTruthy();
    expect(getByText(chat.time)).toBeTruthy();
    expect(getByText(chat.message)).toBeTruthy();
    expect(getByLabelText('profile-image').props.source).toEqual(
      chat.profileImage,
    );
  });
  test('should show badge if unreadCount > 0', () => {
    const {getByText} = renderChatCard(chat);
    expect(getByText(String(chat.unreadCount))).toBeTruthy();
  });
  test('should use default unreadCount = 0 when unreadCount is not provided and should not show badge', () => {
    const {queryByText} = renderChatCard({
      name: 'Anush',
      message: 'When is your joining?',
      time: '10:30 am',
      profileImage: '/image.png',
    });

    expect(queryByText('0')).toBeNull();
  });

  test('should render default profile image if profileImage is null', () => {
    const props: any = {...chat, profileImage: null};
    const {getByLabelText} = renderChatCard(props);
    const image = getByLabelText('profile-image');

    expect(image.props.source).toEqual(
      require('../../../assets/images/profileImage.png'),
    );
  });
});
