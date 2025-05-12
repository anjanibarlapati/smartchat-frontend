import LoadingScreen from './Loading.tsx';
import React from 'react';
import {render} from '@testing-library/react-native';
import { store } from '../../redux/store.ts';
import { Provider } from 'react-redux';


const renderLoadingScreen = () => {
    return render(
        <Provider store={store}>
            <LoadingScreen />
        </Provider>
    );
};

describe('Loading Screen', () => {
  test('Should render loading animation correctly', async () => {
    const {getByTestId} = renderLoadingScreen();
    expect(getByTestId('animation')).toBeTruthy();
  });
});
