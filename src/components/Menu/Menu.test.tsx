import {
  fireEvent,
  render,
} from '@testing-library/react-native';
import {Menu} from './Menu';

const onClick = jest.fn();
const renderMenu = () => {
  return render(
      <Menu onClick={onClick} />
  );
};

describe('Should render Menu component', () => {

  it('should render the menu image', () => {
    const {getByLabelText} = renderMenu();
    expect(getByLabelText('Menu-Image')).toBeTruthy();
    fireEvent.press(getByLabelText('Menu-Image'));
    expect(onClick).toHaveBeenCalled();
  });
});
