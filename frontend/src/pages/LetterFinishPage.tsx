export default function LetterFinishPage() {
  return (
    <section className="section-center">
      <div className="w-64 h-48 my-8 bg-gray-300 flex justify-center items-center" />
      <div className="w-2/5">
        <div className="h-16 my-4 bg-gray-300 flex justify-center items-center">
          동영상 다운받기
        </div>
        <div className="h-16 my-4 bg-gray-300 flex justify-center items-center">
          공유하기
        </div>
      </div>
      <div className="w-3/5 h-80 border flex flex-col justify-center items-center">
        <div className="w-32 h-32 my-8 bg-gray-300 flex justify-center items-center">
          QR
        </div>
        <div className="w-full flex justify-around items-center px-4">
          <p className="w-1/6 h-12 bg-gray-100 flex justify-around items-center">
            링크
          </p>
          <input
            className="w-4/6 h-12 border rounded-3xl mx-4"
            type="text"
            placeholder="링크를 입력해주세요"
          />
          <p className="w-1/6  h-12 bg-gray-100 flex justify-around items-center">
            {" "}
            URL 복사
          </p>
        </div>
      </div>
    </section>
  );
}
