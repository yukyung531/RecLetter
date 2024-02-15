import { useEffect, useState } from 'react';
import { getlastPath } from '../util/get-func';
import { downloadLetter } from '../api/letter';
import { QRCodeCanvas } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LetterFinishPage() {
    const [qrcode, setQrCode] = useState<string>('ExampleURL.com');
    const navigate = useNavigate();
    const [title, setTitle] = useState<string>('');

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
                setQrCode(res.data.letterUrl);
                setTitle(res.data.studioTitle);
                if (res.data.letterUrl === '') {
                    alert('영상을 다운로드 할 수 없습니다');
                    navigate(-1);
                }
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
    /** 영상 다운로드 */
    const handleDownload = () => {
        window.location.href = qrcode;
    };
    const moveStudioList = () => {
        navigate('/studiolist');
    };
    return (
        <section className="section-center">
            <div className="pt-24 mt-64"></div>
            <p className="text-2xl mb-8">{title}</p>
            <video className="w-[800px] h-[450px] my-8 bg-gray-300"  src={qrcode} crossOrigin="anonymous" controls>
            </video>
            <div className="w-1/3">
                <div
                    className="py-2 text-lg rounded-lg my-4 color-bg-main text-white flex justify-center items-center btn-animation cursor-pointer"
                    onClick={handleDownload}
                >
                    동영상 다운로드
                </div>
            </div>
            <div className="w-1/3 flex items-center justify-center">
                <p className="w-[30%] border h-[1px] border-gray-500"></p>
                <p className="mx-6">공유하기</p>
                <p className="w-[30%] border h-[1px] border-gray-500"></p>
            </div>

            <div className="w-1/3 flex flex-col items-center">
                <div className="w-32 h-32 mt-8 mb-4 bg-gray-300 flex justify-center items-center">
                    {qrcode !== '' ? (
                        <QRCodeCanvas value={qrcode} />
                    ) : (
                        <p className="w-32 h-32 flex justify-center items-center">
                            QR
                        </p>
                    )}
                </div>
                <div className="w-full ms-5 py-2 text-lg rounded-lg flex flex-col justify-center items-center">
                    <div className="flex">
                        <p>공유 url</p>
                        <span
                            className="material-symbols-outlined mx-2 text-xl cursor-pointer"
                            onClick={handleClipBoard}
                        >
                            add_link
                        </span>
                    </div>
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
