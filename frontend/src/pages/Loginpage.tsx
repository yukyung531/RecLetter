export default function LoginPage() {
    return (
        <section className="section-center">
            <div className="w-1/3 flex flex-col justify-center items-center">
                <h5 className="m-4 text-3xl text-center p-4 font-bold">
                    Login
                </h5>
                <div className="flex flex-col justify-center items-center">
                    <input
                        className="w-88 py-2 px-3 bg-slate-100 my-2 border-2 rounded text-xl"
                        type="text"
                        placeholder="아이디"
                    />
                    <input
                        className="w-88 py-2 px-3 bg-slate-100 my-2 border-2 rounded text-xl"
                        type="text"
                        placeholder="비밀번호"
                    />
                </div>

                <a
                    href="./studiolist"
                    className=" w-88 block text-2xl color-bg-blue1 text-white border text-center p-2 rounded-md"
                >
                    로그인
                </a>
                <p className="my-4">
                    -------------------------------- 또는
                    --------------------------------
                </p>
                <a
                    href="./studiolist"
                    className="block w-80 text-black border-black text-2xl border text-center py-2 rounded-md"
                >
                    Google으로 로그인하기
                </a>
                <div className="flex justify-center items-center my-2 color-text-blue1">
                    <a className="mx-4 my-2 text-2xl" href="./findid">
                        아이디 찾기
                    </a>
                    <p>/</p>
                    <a className="mx-4 my-2 text-2xl" href="./findpw">
                        비밀번호 찾기
                    </a>
                    <p>/</p>
                    <a className="mx-4 my-2 text-2xl" href="./regist">
                        회원가입
                    </a>
                </div>
            </div>
        </section>
    );
}
