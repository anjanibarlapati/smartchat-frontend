import { render, screen, fireEvent } from '@testing-library/react-native';
import { Menu } from './Menu';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

describe('Tests related to Menu component', () => {
  it('should render the menu image', () => {
    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );
    expect(screen.getByLabelText('Menu-Image')).toBeTruthy();
  });

  it('should close the modal when "Clear Chat" is pressed', () => {
    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    fireEvent.press(screen.getByLabelText('Menu-Image'));
    expect(screen.getByText('Clear Chat')).toBeTruthy();

    fireEvent.press(screen.getByText('Clear Chat'));
    expect(screen.queryByText('Clear Chat')).toBeNull();
  });

  it('should close the modal when "Block" is pressed', () => {
    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    fireEvent.press(screen.getByLabelText('Menu-Image'));
    expect(screen.getByText('Block')).toBeTruthy();

    fireEvent.press(screen.getByText('Block'));
    expect(screen.queryByText('Block')).toBeNull();
  });

  it('should close the modal when clicking outside the modal (overlay)', () => {
    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    fireEvent.press(screen.getByLabelText('Menu-Image'));
    expect(screen.getByText('Clear Chat')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('overlay'));
    expect(screen.queryByText('Clear Chat')).toBeNull();
  });
});
