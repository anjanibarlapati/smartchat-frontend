import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';
import {Menu} from './Menu';

describe('Tests related to Menu component', () => {
  it('should render the menu image', () => {
    render(
      <Provider store={store}>
        <Menu />
      </Provider>,
    );
    expect(screen.getByLabelText('Menu-Image')).toBeTruthy();
  });

  it('should close the modal when "Clear Chat" is pressed', async () => {
    render(
      <Provider store={store}>
        <Menu />
      </Provider>,
    );

    fireEvent.press(screen.getByLabelText('Menu-Image'));
    expect(screen.getByText('Clear Chat')).toBeTruthy();

    fireEvent.press(screen.getByText('Clear Chat'));
    fireEvent.press(screen.getByText('Yes'));
    await waitFor(() => {
      expect(screen.queryByText('Clear Chat')).toBeNull();
    });
  });

  it('should close the modal when "Block" is pressed', async () => {
    render(
      <Provider store={store}>
        <Menu />
      </Provider>,
    );

    fireEvent.press(screen.getByLabelText('Menu-Image'));
    expect(screen.getByText('Block')).toBeTruthy();

    fireEvent.press(screen.getByText('Block'));
    fireEvent.press(screen.getByText('Yes'));

    await waitFor(() => {
      expect(screen.queryByText('Block')).toBeNull();
    });
  });

  it('should close the modal when clicking outside the modal (overlay)', async () => {
    render(
      <Provider store={store}>
        <Menu />
      </Provider>,
    );

    fireEvent.press(screen.getByLabelText('Menu-Image'));
    expect(screen.getByText('Clear Chat')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('overlay'));
    await waitFor(() => {
      expect(screen.queryByText('Clear Chat')).toBeNull();
    });
  });
});
