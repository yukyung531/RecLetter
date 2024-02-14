import { useEffect, useState } from 'react';
import { getlastPath } from '../util/get-func';
import { downloadLetter } from '../api/letter';
import { QRCodeCanvas } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LetterFinishPage() {
    const [qrcode, setQrCode] = useState<string>('ExampleURL.com');
    const navigate = useNavigate();
    const {state} =useLocation();

    useEffect(() => {
        const studioId = getlastPath();
        if (studioId !== '') {
            downloadLetterAPI();
        }
    }, []);
    const downloadLetterAPI = async () => {
        const studioId = getlastPath();
        await downloadLetter(studioId)
            .then((res) => {
                console.log(res);
                setQrCode(res.data);
            })
            .catch((error: Error) => {
                console.log(error);
            });
    };
    const handleClipBoard = () => {
        const currentUrl = document.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            alert('링크가 복사되었습니다.');
        });
    };
    const moveStudioList = () => {
        navigate('/studiolist');
    };
    return (
        <section className="section-center">
            <div className="pt-16"></div>
            <p className="text-2xl my-2">{state}</p>
            <div className="w-64 h-48 my-8 bg-gray-300 flex justify-center items-center" />
            <div className="w-1/3">
                <div className="py-2 text-lg rounded-lg my-4 color-bg-main text-white flex justify-center items-center btn-animation">
                    동영상 다운로드
                </div>
                <div className="py-2 text-lg rounded-lg my-4 bg-white border color-border-main color-text-main flex justify-center items-center btn-animation">
                    공유하기
                </div>
            </div>
            <div className="w-1/3 flex">
                <div className="w-32 h-32 my-8 bg-gray-300 flex justify-center items-center">
                    {qrcode !== '' ? (
                        <QRCodeCanvas value={qrcode} />
                    ) : (
                        <p className="w-32 h-32 flex justify-center items-center">
                            QR
                        </p>
                    )}
                </div>
                <div className="w-full ms-5 py-2 text-lg rounded-lg my-4 flex flex-col justify-end items-start">
                    <div className="flex">
                        <p>공유 url</p>
                        <span
                            className="material-symbols-outlined mx-2 text-xl cursor-pointer"
                            onClick={handleClipBoard}
                        >
                            add_link
                        </span>
                    </div>
                    <p>{qrcode}</p>
                </div>
            </div>
            <div className="w-1/4">
                <div
                    className="py-2 text-lg rounded-lg my-4 bg-white border color-border-main color-text-main flex justify-center items-center cursor-pointer btn-animation"
                    onClick={moveStudioList}
                >
                    <p>나도 영상편지 만들기</p>
                    <img
                        className="w-6 mx-2 color-bg-main"
                        src="/src/assets/icons/mail.png"
                        alt=""
                    />
                </div>
            </div>
        </section>
    );
}
