interface PropDelete {
    onClickOK : React.MouseEventHandler<HTMLButtonElement>
    onClickCancel : React.MouseEventHandler<HTMLButtonElement>
}


export default function DeleteCheckWindow({onClickOK, onClickCancel} : PropDelete) {
    
    return (
        <>
        <div className="w-[555px] h-[277px] p-2 border-solid border-2 border-[#363636] fixed bg-[#FAFAF0] text-center flex flex-col">
            <div className="h-2/3 flex justify-center items-center">
                <p className="text-3xl">정말로 삭제하시겠습니까?</p>
            </div>
            <div className="h-1/3 flex justify-evenly">
                <button className="text-xl bg-[#F36870] text-white px-4" onClick={onClickOK}>
                    네, 삭제하겠습니다.
                </button>
                <button className="text-xl border-[#F36870] border-2 text-[#F36870] px-4" onClick={onClickCancel}>
                    아니오, 삭제하지 않겠습니다.
                </button>
            </div>
        </div>
    </>
    )
}