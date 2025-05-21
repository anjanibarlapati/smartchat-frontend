import React from 'react';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react-native';
import LoadingIndicator from './Loading.tsx';
import {store} from '../../redux/store.ts';

describe('LoadingIndicator', () => {
  it('Should render nothing when visible is false', () => {
    const {queryByTestId} = render(
      <Provider store={store}>
        <LoadingIndicator visible={false} />
      </Provider>,
    );
    expect(queryByTestId('animation')).toBeNull();
  });

  it('Should renders Lottie animation view when visible is true', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <LoadingIndicator visible={true} />
      </Provider>,
    );
    const animation = getByTestId('animation');
    expect(animation).toBeTruthy();
  });
});
