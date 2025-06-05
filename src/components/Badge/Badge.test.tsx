import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react-native';
import { store } from '../../redux/store';
import { Badge } from './Badge';

const renderBadge = (value: string, size: 'small' | 'big') => {
  return render(
    <Provider store={store}>
      <Badge value={value} size={size}/>
    </Provider>,
  );
};

describe('Badge component', () => {
  it('Should render the value', () => {
    const {getByText} = renderBadge('3', 'small');
    expect(getByText('3')).toBeTruthy();
  });

  it('Should not render the text when value is empty string', () => {
    const {queryByText} = renderBadge('0', 'big');
    expect(queryByText('')).toBeNull();
  });
  it('Should not render anything when value is undefined', () => {
    const { queryByText } = renderBadge('', 'small');
    expect(queryByText('')).toBeNull();
  });
  it('should apply correct container style based on size', () => {
    const { getByText } = renderBadge('5', 'big');

    const badgeBig = getByText('5');
    const bigStyle = badgeBig.parent?.parent?.props?.style;
    expect(bigStyle).toEqual(expect.objectContaining({ width: 24 }));

    renderBadge('5', 'small');

    const badgeSmall = screen.getByText('5');
    const smallStyle = badgeSmall.parent?.parent?.props?.style;
    expect(smallStyle).toEqual(expect.objectContaining({ width: 20 }));
  });
});
