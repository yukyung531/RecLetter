export default function RegistPage() {
  return (
    <section className="section-center">
      <ul className="w-1/3 flex flex-col justify-center items-center border">
        <h5 className=" text-2xl">회원가입</h5>
        <li className="flex my-4">
          <p className="mx-4">아이디</p>
          <input type="text" className="border" />
          <button className="border">아이디 확인</button>
        </li>
        <li className="flex my-4">
          <p className="mx-4">이름</p>
          <input type="text" className="border" />
        </li>
        <li className="flex my-4">
          <p className="mx-4">이메일</p>
          <input type="text" className="border" />
          <button className="border">인증코드 전송</button>
        </li>
        <li className="flex my-4">
          <p className="mx-4">인증코드</p>
          <input type="text" className="border" />
          <button className="border">인증하기</button>
        </li>
        <li className="flex my-4">
          <p className="mx-4">비밀번호</p>
          <input type="text" className="border" />
        </li>
        <li className="flex my-4">
          <p className="mx-4">비밀번호 확인</p>
          <input type="text" className="border" />
        </li>
        <li className="w-full flex my-4 justify-around">
          <a href="/" className="border p-4 bg-slate-200">
            회원가입
          </a>
          <button className="border p-4 bg-blue-100">구글로 회원가입</button>
        </li>
      </ul>
    </section>
  );
}
