import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface LoginState {
    isLogin: boolean;
    studioId: string[];
    studioName: string;
    theme: number;
    customColorSet: string[];
    loginRoom: string;
}
const initialState: LoginState = {
    isLogin: false,
    studioId: [],
    studioName: '',
    theme: 0,
    customColorSet: [],
    loginRoom: '',
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
        //구글 로그인을 위한 이동
        googleLoginMain: (state, action) => {
            state.loginRoom = action.payload;
        },
        //studio 추가
        studioAddState: (state, action) => {
            const newItem: string = action.payload;
            state.studioId = [...state.studioId, newItem];
        },
        //studioid에 해당하는 값 삭제 (인자값응로 studio)
        studioDeleteState: (state, action) => {
            state.studioId.filter((id) => id !== action.payload);
        },
        studioNameState: (state, action) => {
            state.studioName = action.payload;
        },
        themeState: (state, action) => {
            state.theme = action.payload;
        },
        colorAddState: (state, action) => {
            const newItem: string = action.payload;
            state.customColorSet = [...state.customColorSet, newItem];
        },
        colorDeleteState: (state, action) => {
            const payload = action.payload;
            state.customColorSet = state.customColorSet.filter(
                (color) => color !== payload
            );
        },
    },
});
export const {
    loginState,
    studioState,
    studioAddState,
    studioDeleteState,
    studioNameState,
    themeState,
    colorAddState,
    colorDeleteState,
    googleLoginMain,
} = loginSlice.actions;
export default loginSlice.reducer;
