import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import SuccessModal from './SuccessModal';

interface PropType {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    currentUrl: string;
}

export default function ShareModal({ onClick, currentUrl }: PropType) {
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const handleClipBoard = () => {
        const currentUrl = document.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            setIsCopied(true);
        });
    };

    return (
        <>
            <div className="w-full h-full bg-[#626262] fixed top-0 left-0 z-10 opacity-30"></div>
            <div
                className="w-[400px] h-[290px] z-50 fixed top-1/2 left-1/2 shadow-lg"
                style={{ transform: 'translate(-50%, -70%)' }}
            >
                <div className="rounded-t-xl bg-[#FF777F] w-full h-[20px]"></div>
                <div className="rounded-b-xl bg-[#FFFFF9] w-full h-[290px] flex flex-col items-center justify-between">
                    <p className="mt-3 text-xl text-black">공유하기</p>
                    <div className="flex flex-col items-center my-2">
                        <QRCodeCanvas className="" value={currentUrl} />
                        <div
                            className="w-full py-2 text-lg rounded-lg flex flex-col justify-center items-center cursor-pointer"
                            onClick={handleClipBoard}
                        >
                            <div className="flex">
                                <p className="text-[#FF777F] underline">
                                    공유링크 복사하기
                                </p>
                                <span className="material-symbols-outlined mx-1 text-xl cursor-pointer text-[#FF777F]">
                                    content_copy
                                </span>
                            </div>
                            <p className="text-sm text-[#626262]">
                                {isCopied ? '링크가 복사되었습니다' : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        className="mb-2 h-[12%] w-1/3 text-xl text-[#626262] border-2 border-[#E5E5E5] rounded-lg hover:bg-[#E5E5E5]"
                        onClick={onClick}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </>
    );
}
