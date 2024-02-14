interface PropType {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    message: string;
}

export default function SuccessModal({ onClick, message }: PropType) {
    return (
        <>
            <div className="w-screen h-screen bg-[#626262] fixed top-0 left-0 z-10 opacity-30"></div>
            <div
                className="w-[400px] h-[290px] z-20 fixed shadow-lg"
                style={{
                    transform: 'translate(-50%, -70%)',
                    top: '50vh',
                    left: '50vw',
                }}
            >
                <div className="rounded-t-xl bg-[#65A6F2] w-full h-[20px]"></div>
                <div className="rounded-b-xl bg-[#FFFFF9] w-full h-[290px] flex flex-col items-center justify-center">
                    <img
                        className="w-1/5"
                        src="/src/assets/icons/guide_message.png"
                        alt="촬영 안내"
                    />
                    <p className="mt-5 text-xl text-black">{message}</p>
                    <button
                        className="mt-[30px] h-[12%] w-1/4 text-xl text-[#65A6F2] border-2 border-[#65A6F2] rounded-lg hover:text-white hover:bg-[#65A6F2]"
                        onClick={onClick}
                    >
                        확인
                    </button>
                </div>
            </div>
        </>
    );
}
