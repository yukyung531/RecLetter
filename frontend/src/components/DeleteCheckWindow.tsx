interface PropDelete {
    onClickOK: React.MouseEventHandler<HTMLButtonElement>;
    onClickCancel: React.MouseEventHandler<HTMLButtonElement>;
}

export default function DeleteCheckWindow({
    onClickOK,
    onClickCancel,
}: PropDelete) {
    return (
        <>
            {/* new delete modal */}
            <div className="w-full h-full bg-[#626262] absolute top-0 left-0 z-10 opacity-30"></div>
            <div className="w-[500px] h-[350px] z-20 absolute top-1/3 left-1/3 shadow-lg">
                <div className="rounded-t bg-[#FF777F] w-full h-[20px]"></div>
                <div className="rounded-b bg-[#FFFFF9] w-full h-[330px] flex flex-col items-center justify-around">
                    <img
                        className="w-1/5"
                        src="/src/assets/icons/delete_message.png"
                        alt="삭제 확인"
                    />
                    <p className="text-2xl text-black">
                        영상을 삭제하시겠습니까?
                    </p>
                    <div className="flex w-full h-1/5 justify-around">
                        <button
                            className="h-full w-2/5 text-2xl text-[#FF777F] border-2 border-[#FF777F] rounded-lg shadow-lg hover:text-white hover:bg-[#FF4954]"
                            onClick={onClickCancel}
                        >
                            아니오
                        </button>
                        <button
                            className="h-full w-2/5 text-2xl text-white bg-[#FF777F] border-2 border-[#FF777F] rounded-lg shadow-lg hover:text-white hover:bg-[#FF4954]"
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
