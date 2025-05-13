import {render} from '@testing-library/react-native';
import {Badge} from './Badge';
import {Provider} from 'react-redux';
import {store} from '../../redux/store';

const renderBadge = (value: string) => {
  return render(
    <Provider store={store}>
      <Badge value={value} />
    </Provider>,
  );
};

describe('Badge component', () => {
  it('Should render the value', () => {
    const {getByText} = renderBadge('3');
    expect(getByText('3')).toBeTruthy();
  });

  it('Should not render the text when value is empty string', () => {
    const {queryByText} = renderBadge('');
    expect(queryByText('')).toBeNull();
  });
});
