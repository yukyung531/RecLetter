import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './counter-slice';

export default configureStore({
    reducer: {
        loginFlag: loginSlice,
    },
});
