import { render, screen } from '@testing-library/react-native';
import { Menu } from './Menu';

describe('Tests related to Menu component', () => {

    it('Should render the menu image', () => {
        render(<Menu />);
        expect(screen.getByLabelText('Menu-Image')).toBeTruthy();
    });
});
