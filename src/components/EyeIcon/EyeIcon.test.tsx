import { render } from '@testing-library/react-native';
import { EyeIcon } from './EyeIcon';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

const renderEyeIcon = (showPassword: boolean, togglePasswordVisibility: ()=> void)=>{
    return render(
    <Provider store={store}>
        <EyeIcon showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility}/>
    </Provider>
    );
};

describe('Eye Icon', ()=>{
    it('Should render eye icon when showPassword is true', ()=>{
        const {getByLabelText} = renderEyeIcon(true, jest.fn());
        const eyeIcon = getByLabelText('eye-icon');
        expect(eyeIcon.props.source).toEqual(
      require('../../../assets/images/eyeIcon.png')
    );
    });

    it('Should render eye off icon when showPassword is false', ()=>{
        const {getByLabelText} = renderEyeIcon(false, jest.fn());
        const eyeIcon = getByLabelText('eye-icon');
        expect(eyeIcon.props.source).toEqual(
      require('../../../assets/images/eyeoffIcon.png')
    );
    });
});
