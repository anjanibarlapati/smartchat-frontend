import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { Home } from './Home';
import { store } from '../../redux/store';


function renderHomeScreen () {
    return render(
        <Provider store={store}>
           <Home />
        </Provider>
    );
}

describe('Home Screen', () => {
  test('renders loading animation correctly', async () => {
    const {getByText} = renderHomeScreen();
    expect(getByText(/welcome to home/i)).toBeTruthy();
  });
});
