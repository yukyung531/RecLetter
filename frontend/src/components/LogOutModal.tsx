export default function LogOutModal() {
    return (
        <>
            <div className="w-full h-full bg-[#626262] absolute top-0 left-0 z-10 opacity-30"></div>
            <div className="w-[500px] h-[350px] z-20 absolute top-1/3 left-1/3 shadow-lg">
                <div className="rounded-t bg-[#65A6F2] w-full h-[10px]"></div>
                <div className="rounded-b bg-[#FFFFF9] w-full h-[340px] flex flex-col items-center justify-around">
                    <img
                        className="w-1/5"
                        src="/src/assets/icons/logout_confirm.png"
                        alt="로그아웃 확인"
                    />
                    <p className="text-2xl">로그아웃 되었습니다.</p>
                    <button className="h-1/5 w-2/5 text-2xl text-[#65A6F2] border-2 border-[#65A6F2] rounded-lg shadow-lg hover:text-white hover:bg-[#65A6F2]">
                        확인
                    </button>
                </div>
            </div>
        </>
    );
}
