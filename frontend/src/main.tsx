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
import ClipRecodePage from './pages/ClipRecodePage.tsx';
import ClipEditPage from './pages/ClipEditPage.tsx';
import LetterMakePage from './pages/LetterMakePage.tsx';
import LetterFinishPage from './pages/LetterFinishPage.tsx';
import FindResultPage from './pages/FindResultPage.tsx';
import MyPage from './pages/MyPage.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from './util/store.ts';
import ChattingBox from './components/ChattingBox.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Mainpage />}></Route>
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
                            path="/cliprecode/:studioId"
                            element={<ClipRecodePage />}
                        ></Route>
                        <Route
                            path="/clipedit/:studioId"
                            element={<ClipEditPage />}
                        ></Route>
                        <Route
                            path="/lettermake/:studioId"
                            element={<LetterMakePage />}
                        ></Route>
                        <Route
                            path="/letterfinish"
                            element={<LetterFinishPage />}
                        ></Route>
                    </Routes>
                    <ChattingBox />
                </BrowserRouter>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>
);
