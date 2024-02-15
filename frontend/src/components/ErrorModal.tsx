interface PropType {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    message: string;
}

export default function ErrorModal({ onClick, message }: PropType) {
    return (
        <>
            <div className="w-full h-full bg-[#626262] fixed top-0 left-0 z-10 opacity-30"></div>
            <div
                className="w-[400px] h-[290px] z-50 fixed top-1/2 left-1/2 shadow-lg"
                style={{ transform: 'translate(-50%, -70%)' }}
            >
                <div className="rounded-t-xl bg-[#FF777F] w-full h-[20px]"></div>
                <div className="rounded-b-xl bg-[#FFFFF9] w-full h-[290px] flex flex-col items-center justify-center">
                    <img
                        className="w-1/5"
                        src="/src/assets/icons/error_message.png"
                        alt="로그아웃 확인"
                    />
                    <p className=" w-[84%] text-center mt-5 text-lg text-black">
                        {message}
                    </p>
                    <button
                        className="mt-[30px] h-[12%] w-1/4 text-xl text-[#FF777F] border-2 border-[#FF777F] rounded-lg hover:text-white hover:bg-[#FF4954]"
                        onClick={onClick}
                    >
                        확인
                    </button>
                </div>
            </div>
        </>
    );
}
