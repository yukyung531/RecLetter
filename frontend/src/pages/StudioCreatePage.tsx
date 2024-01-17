export default function StudioCreatePage() {
    return (
        <section className="relative section-top pt-10 mt-20 ml-16">
            <div>
                <h5 className="text-3xl font-bold">스튜디오 제목</h5>
                <input
                    className="w-120 py-3 px-3 my-4 border-2 rounded text-xl"
                    type="text"
                    placeholder="Placeholder"
                />
                <h5 className="text-3xl font-bold">마감 일자</h5>
                <input
                    className="w-120 py-3 px-3 my-4 border-2 rounded text-xl"
                    type="text"
                    placeholder="Placeholder"
                />
                <p className="btn-cover color-bg-yellow2">멤버추가</p>
                <h5 className="text-3xl font-bold mt-16">영상 프레임</h5>
                <div className="flex">
                    <img
                        className="image-select-size"
                        src="/src/assets/images/nothumb.png"
                    />
                    <img
                        className="image-select-size"
                        src="/src/assets/images/nothumb.png"
                    />
                    <img
                        className="image-select-size"
                        src="/src/assets/images/nothumb.png"
                    />
                    <img
                        className="image-select-size"
                        src="/src/assets/images/nothumb.png"
                    />
                </div>
            </div>
            {/* <div className="border w-96 flex flex-col items-center p-4">
        <p className="w-full h-12 bg-gray-200 flex justify-center items-center">
          멤버 추가
        </p>
        <div className="w-full h-6 my-2 bg-gray-200 flex justify-center items-center">
          +
        </div>
        <ul className="w-full">
          <li className="flex justify-between px-8 py-2 border my-2">
            <p>은쮸</p>
            <span>x</span>
          </li>
          <li className="flex justify-between px-8 py-2 border my-2">
            <p>연쮸</p>
            <span>x</span>
          </li>
          <li className="flex justify-between px-8 py-2 border my-2">
            <p>유꼉</p>
            <span>x</span>
          </li>
          <li className="flex justify-between px-8 py-2 border my-2">
            <p>뗜재</p>
            <span>x</span>
          </li>
          <li className="flex justify-between px-8 py-2 border my-2">
            <p>하영</p>
            <span>x</span>
          </li>
          <li className="flex justify-between px-8 py-2 border my-2">
            <p>때웅</p>
            <span>x</span>
          </li>
        </ul>
      </div> */}
            <div className="w-full flex justify-end pe-32 py-12">
                <a href="/studiomain" className="btn-cover color-bg-blue1">
                    스튜디오 생성
                </a>
            </div>
        </section>
    );
}
