import React from 'react';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react-native';
import LoadingIndicator from './Loading.tsx';
import {store} from '../../redux/store.ts';

describe('LoadingIndicator', () => {
  it('Should render nothing when visible is false', () => {
    const {queryByLabelText} = render(
      <Provider store={store}>
        <LoadingIndicator visible={false} />
      </Provider>,
    );
    expect(queryByLabelText('loading-animation')).toBeNull();
  });

  it('Should renders Lottie animation view when visible is true', () => {
    const {getByLabelText} = render(
      <Provider store={store}>
        <LoadingIndicator visible={true} />
      </Provider>,
    );
    const animation = getByLabelText('loading-animation');
    expect(animation).toBeTruthy();
  });
});
