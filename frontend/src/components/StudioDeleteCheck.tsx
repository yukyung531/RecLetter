interface PropDelete {
    onClickOK: React.MouseEventHandler<HTMLButtonElement>;
    onClickCancel: React.MouseEventHandler<HTMLButtonElement>;
}

export default function StudioDeleteCheck({
    onClickOK,
    onClickCancel,
}: PropDelete) {
    return (
        <>
            {/* new delete modal */}
            <div className="w-full h-full bg-[#626262] fixed top-0 left-0 z-30 opacity-30"></div>
            <div
                className="w-[400px] h-[290px] z-40 fixed top-1/2 left-1/2 shadow-lg"
                style={{ transform: 'translate(-50%, -70%)' }}
            >
                <div className="rounded-t-xl bg-[#FF777F] w-full h-[20px]"></div>
                <div className="rounded-b-xl bg-[#FFFFF9] w-full h-[290px] flex flex-col items-center justify-center">
                    <img
                        className="w-1/5"
                        src="/src/assets/icons/delete_message.png"
                        alt="삭제 확인"
                    />
                    <p className="mt-5 text-xl text-black">
                        스튜디오를 삭제하시겠습니까?
                    </p>
                    <div className="mt-[30px] flex w-full h-[12%] gap-7  justify-center">
                        <button
                            className="h-full w-1/4 text-xl text-[#FF777F] border-2 border-[#FF777F] rounded-lg hover:text-white hover:bg-[#FF4954]"
                            onClick={onClickCancel}
                        >
                            아니오
                        </button>
                        <button
                            className="h-full w-1/4 text-xl text-white bg-[#FF777F] border-2 border-[#FF777F] rounded-lg hover:text-white hover:bg-[#FF4954]"
                            onClick={onClickOK}
                        >
                            네
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
