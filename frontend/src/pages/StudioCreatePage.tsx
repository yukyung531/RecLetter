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

            <div className="w-full flex justify-end pe-32 py-12">
                <a href="/studiomain" className="btn-cover color-bg-blue1">
                    스튜디오 생성
                </a>
            </div>
        </section>
    );
}
