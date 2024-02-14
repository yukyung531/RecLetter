import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/common.css';
import './assets/css/variables.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header.tsx';
import Mainpage from './pages/Mainpage.tsx';
import LoginPage from './pages/Loginpage.tsx';
import RegistPage from './pages/RegistPage.tsx';
import FindIdPage from './pages/FindIdPage.tsx';
import FindPwPage from './pages/FindPwPage.tsx';
import StudioListPage from './pages/StudioListPage.tsx';
import StudioCreatePage from './pages/StudioCreatePage.tsx';
import StudioMainPage from './pages/StudioMainPage.tsx';
import ClipRecordPage from './pages/ClipRecordPage.tsx';
import ClipEditPage from './pages/ClipEditPage.tsx';
import LetterMakePage from './pages/LetterMakePage.tsx';
import LetterViewPage from './pages/LetterViewPage.tsx';
import LetterFinishPage from './pages/LetterFinishPage.tsx';
import FindResultPage from './pages/FindResultPage.tsx';
import MyPage from './pages/MyPage.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store, persistor } from './util/store.ts';
import ChattingBox from './components/ChattingBox.tsx';
import { PersistGate } from 'redux-persist/integration/react';
import SocialPage from './pages/SocialPage.tsx';
import ErrorPage from './pages/ErrorPage.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route
                            path="/"
                            element={<Mainpage />}
                            errorElement={<ErrorPage />}
                        ></Route>
                        <Route path="/login" element={<LoginPage />}></Route>
                        <Route path="/mypage" element={<MyPage />}></Route>
                        <Route path="/regist" element={<RegistPage />}></Route>
                        <Route path="/findid" element={<FindIdPage />}></Route>
                        <Route path="/findpw" element={<FindPwPage />}></Route>
                        <Route
                            path="/findresult"
                            element={<FindResultPage />}
                        ></Route>
                        <Route
                            path="/studiolist"
                            element={<StudioListPage />}
                        ></Route>
                        <Route
                            path="/studiomain/:studioId"
                            element={<StudioMainPage />}
                        ></Route>
                        <Route
                            path="/create"
                            element={<StudioCreatePage />}
                        ></Route>
                        <Route
                            path="/cliprecord/:studioId"
                            element={<ClipRecordPage />}
                        ></Route>
                        <Route
                            path="/clipedit/:studioId"
                            errorElement={<ErrorPage />}
                            element={<ClipEditPage />}
                        ></Route>
                        <Route
                            path="/lettermake"
                            element={<LetterMakePage />}
                        ></Route>
                        <Route
                            path="/lettermake/:studioId"
                            element={<LetterMakePage />}
                        ></Route>
                        <Route
                            path="/letterview/:studioId"
                            element={<LetterViewPage />}
                        ></Route>
                        <Route
                            path="/letterfinish/:studioId"
                            element={<LetterFinishPage />}
                        ></Route>
                        <Route
                            path="/login/oauth2/code/google"
                            element={<SocialPage />}
                        ></Route>
                    </Routes>
                    <ChattingBox />
                </BrowserRouter>
            </QueryClientProvider>
        </PersistGate>
    </Provider>
);
