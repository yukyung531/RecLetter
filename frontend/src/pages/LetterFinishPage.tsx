import { useEffect, useState } from 'react';
import { getlastPath } from '../util/get-func';
import { downloadLetter } from '../api/letter';
import { QRCodeCanvas } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import ShareModal from '../components/ShareModal';
import ErrorModal from '../components/ErrorModal';

export default function LetterFinishPage() {
    const [qrcode, setQrCode] = useState<string>('ExampleURL.com');
    const navigate = useNavigate();
    const [title, setTitle] = useState<string>('');
    const [currentUrl, setCurrentUrl] = useState<string>('');

    //공유 모달 불러오기
    const [isModalActive, setIsModalActive] = useState<boolean>(false);

    /**closeModal()
     * 모달창 닫기
     */
    const closeModal = () => {
        setIsModalActive(false);
    };

    //에러모달
    const [isErrorModal, setIsErrorModal] = useState<boolean>(false);

    const closeError = () => {
        setIsErrorModal(false);
        navigate(-1);
    };

    useEffect(() => {
        const studioId = getlastPath();
        if (studioId !== '') {
            downloadLetterAPI();
        }
        setCurrentUrl(document.location.href);
    }, []);
    const downloadLetterAPI = async () => {
        const studioId = getlastPath();
        await downloadLetter(studioId)
            .then((res) => {
                // console.log(res);
                setQrCode(res.data.letterUrl);
                setTitle(res.data.studioTitle);
                if (res.data.letterUrl === '') {
                    setIsErrorModal(true);
                    // alert('영상을 다운로드 할 수 없습니다');
                    // navigate(-1);
                }
            })
            .catch((error: Error) => {
                setIsErrorModal(true);
                // alert('영상을 다운로드 할 수 없습니다');
                // navigate(-1);
            });
    };

    // const handleClipBoard = () => {
    //     const currentUrl = document.location.href;
    //     navigator.clipboard.writeText(currentUrl).then(() => {
    //         alert('링크가 복사되었습니다.');
    //     });
    // };
    /** 영상 다운로드 */
    const handleDownload = () => {
        window.location.href = qrcode;
    };
    const moveStudioList = () => {
        window.scrollTo(0, 0);
        navigate('/studiolist');
    };
    return (
        <section className="section-center">
            {isModalActive ? (
                <ShareModal onClick={closeModal} currentUrl={currentUrl} />
            ) : (
                <></>
            )}
            {isErrorModal ? (
                <ErrorModal
                    onClick={closeError}
                    message="영상을 다운로드할 수 없습니다."
                />
            ) : (
                <></>
            )}
            <div className="pt-1 mt-2"></div>
            <p className="text-2xl">{title}</p>
            <video
                className="w-[640px] h-[360px] my-4 bg-gray-300"
                src={qrcode}
                crossOrigin="anonymous"
                controls
            ></video>
            <div className="w-1/3">
                <div
                    className="py-2 text-lg rounded-lg my-4 color-bg-main text-white flex justify-center items-center btn-animation cursor-pointer"
                    onClick={handleDownload}
                >
                    동영상 다운로드
                </div>
                <div
                    className="py-2 text-lg rounded-lg my-4 text-[#FF777F] border-2 border-[#FF777F] hover:color-bg-main hover:text-white flex justify-center items-center btn-animation cursor-pointer"
                    onClick={() => {
                        setIsModalActive(true);
                    }}
                >
                    공유하기
                </div>
            </div>

            {/* <div className="w-1/3 flex flex-col items-center">
                <div className="w-32 h-32 mt-8 mb-4 bg-gray-300 flex justify-center items-center">
                    {qrcode !== '' ? (
                        <QRCodeCanvas value={currentUrl} />
                    ) : (
                        <p className="w-32 h-32 flex justify-center items-center">
                            QR
                        </p>
                    )}
                </div>
                <div className="w-full ms-5 py-2 text-lg rounded-lg flex flex-col justify-center items-center">
                    <div className="flex">
                        <p>링크 복사하기</p>
                        <span
                            className="material-symbols-outlined mx-2 text-xl cursor-pointer"
                            onClick={handleClipBoard}
                        >
                            add_link
                        </span>
                    </div>
                </div>
            </div> */}
            <div className="w-1/4">
                <div
                    className="py-2 text-lg rounded-lg my-4 bg-white color-text-main flex justify-center items-center cursor-pointer btn-animation"
                    onClick={moveStudioList}
                >
                    <p className="underline">나도 영상편지 만들기</p>
                    <img
                        className="w-6 mx-2"
                        src="/src/assets/icons/finish_letter.png"
                        alt=""
                    />
                </div>
            </div>
        </section>
    );
}
