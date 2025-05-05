import { render } from '@testing-library/react-native';
import Button from './Button';


describe('Test for button component', ()=>{
    test('renders button with correct title', () =>{
        const {getByText} = render(<Button label="Register" />);
        const buttonElement = getByText('Register');
        expect(buttonElement).toBeTruthy();

    });
});

