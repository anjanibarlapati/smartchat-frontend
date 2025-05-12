import { render } from '@testing-library/react-native';
import Button from './Button';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

const renderButton = (label: string) => {
    return render(
        <Provider store={store}>
            <Button label={label} />
        </Provider>
    );
};


describe('Test for button component', ()=>{
    test('Should render button with correct title', () =>{
        const {getByText} = renderButton('Register');
        const buttonElement = getByText('Register');
        expect(buttonElement).toBeTruthy();

    });
});

