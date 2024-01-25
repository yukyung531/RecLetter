import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface LoginState {
    isLogin: boolean;
}
const initialState: LoginState = {
    isLogin: false,
};

export const loginSlice = createSlice({
    name: 'LoginSlice',
    initialState,
    reducers: {
        loginState: (state, action) => {
            state.isLogin = action.payload;
        },
    },
});
export const { loginState } = loginSlice.actions;
export default loginSlice.reducer;
