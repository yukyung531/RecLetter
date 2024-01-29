import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface LoginState {
    isLogin: boolean;
    studioId: string;
}
const initialState: LoginState = {
    isLogin: false,
    studioId: '',
};

export const loginSlice = createSlice({
    name: 'LoginSlice',
    initialState,
    reducers: {
        loginState: (state, action) => {
            state.isLogin = action.payload;
        },
        studioState: (state, action) => {
            state.studioId = action.payload;
        },
    },
});
export const { loginState, studioState } = loginSlice.actions;
export default loginSlice.reducer;
