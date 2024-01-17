export default function FindResultPage() {
    return (
        <section className="section-center">
            <p className="text-3xl font-bold mx-4 my-6">발송완료</p>

            <div className="flex flex-col text-xl my-12 items-center justify-center">
                <p>이메일로 아이디를 보냈습니다!</p>
                <p>이메일을 확인해주세요(아이디 찾기)</p>
            </div>
            <a
                href="/login"
                className="w-88 py-3 px-3 my-8 rounded text-xl text-center color-bg-yellow2"
            >
                로그인 페이지로
            </a>
        </section>
    );
}
