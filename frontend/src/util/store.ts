import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './counter-slice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['loginFlag'],
};

const persistedReducer = persistReducer(persistConfig, loginSlice);

const store = configureStore({
    reducer: {
        loginFlag: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        // 사용자 정의 객체등에서 직렬화가 힘들때 경고를 하는 구문을 해제하는 미들웨어 설정
        getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);
export { store, persistor };
