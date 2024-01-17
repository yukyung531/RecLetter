export default function FindPwPage() {
    return (
        <section className="section-center">
            <p className="text-3xl font-bold mx-4 my-6">비밀번호 찾기</p>

            <div className="flex flex-col my-4 items-center justify-center">
                <input
                    className="w-88 py-2 px-3 mt-12 mb-2 border-2 rounded text-xl"
                    type="text"
                    placeholder="아이디를 입력해주세요."
                />
                <input
                    className="w-88 py-2 px-3 mb-12 mt-2 border-2 rounded text-xl"
                    type="text"
                    placeholder="이메일을 입력해주세요."
                />
            </div>
            <a
                href="/findresult"
                className="w-88 py-3 px-3 my-12 rounded text-xl color-bg-yellow2 text-center"
            >
                비밀번호 찾기
            </a>
        </section>
    );
}
