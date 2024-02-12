interface PropType {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function LoginErrorModal({ onClick }: PropType) {
    return (
        <>
            <div className="w-full h-full bg-[#626262] absolute top-0 left-0 z-10 opacity-30"></div>
            <div className="w-[500px] h-[350px] z-20 absolute top-1/3 left-1/3 shadow-lg">
                <div className="rounded-t bg-[#FF777F] w-full h-[20px]"></div>
                <div className="rounded-b bg-[#FFFFF9] w-full h-[330px] flex flex-col items-center justify-around">
                    <img
                        className="w-1/5"
                        src="/src/assets/icons/error_message.png"
                        alt="로그아웃 확인"
                    />
                    <p className="text-2xl text-black">
                        아이디 또는 비밀번호를 잘못 입력하였습니다.
                    </p>
                    <button
                        className="h-1/5 w-2/5 text-2xl text-[#FF777F] border-2 border-[#FF777F] rounded-lg shadow-lg hover:text-white hover:bg-[#FF4954]"
                        onClick={onClick}
                    >
                        확인
                    </button>
                </div>
            </div>
        </>
    );
}
