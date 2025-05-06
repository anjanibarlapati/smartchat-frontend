import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from './reducer';


const store = configureStore({
    reducer: {
        registration: registrationReducer,
    },
});

export default store;
