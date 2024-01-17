import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/scss/common.scss';
import './assets/scss/variables.css';
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

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Header />
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Mainpage />}></Route>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route path="/mypage" element={<MyPage />}></Route>
                <Route path="/regist" element={<RegistPage />}></Route>
                <Route path="/findid" element={<FindIdPage />}></Route>
                <Route path="/findpw" element={<FindPwPage />}></Route>
                <Route path="/findresult" element={<FindResultPage />}></Route>
                <Route path="/studiolist" element={<StudioListPage />}></Route>
                <Route path="/studiomain" element={<StudioMainPage />}></Route>
                <Route path="/create" element={<StudioCreatePage />}></Route>
                <Route path="/cliprecode" element={<ClipRecodePage />}></Route>
                <Route path="/clipedit" element={<ClipEditPage />}></Route>
                <Route path="/lettermake" element={<LetterMakePage />}></Route>
                <Route
                    path="/letterfinish"
                    element={<LetterFinishPage />}
                ></Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
