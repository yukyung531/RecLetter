import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface LoginState {
    isLogin: boolean;
    studioId: string;
    studioName: string;
}
const initialState: LoginState = {
    isLogin: false,
    studioId: '',
    studioName: '',
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
        studioNameState: (state, action) => {
            state.studioName = action.payload;
        },
    },
});
export const { loginState, studioState, studioNameState } = loginSlice.actions;
export default loginSlice.reducer;
