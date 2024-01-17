export default function LetterMakePage() {
    return (
        <section className="relative section-top">
            <div className="h-20 w-full px-12 color-text-black flex justify-between items-center">
                <div className="flex items-center">
                    <span className="material-symbols-outlined">
                        arrow_back_ios
                    </span>
                    <p className="text-3xl">studio1</p>
                    <div className="ml-20" />
                    <p>2024-01-14-02:12AM</p>
                </div>
                <a
                    href="/studiomain"
                    className="btn-cover color-bg-blue3 text-white"
                >
                    편집하기
                </a>
            </div>

            {/* 중앙 섹션 */}
            <div className="flex w-full editor-height">
                {/* 좌측부분 */}
                <div className="w-1/4 editor-height flex">
                    {/* 카테고리 */}
                    <div className="w-1/5 ">
                        <div className="h-28 bg-orange-100 flex flex-col justify-center items-center categori-selected">
                            <span className="material-symbols-outlined text-3xl">
                                movie_edit
                            </span>
                            <p className="font-bold">영상</p>
                        </div>
                        <div className="h-28 bg-orange-100 flex flex-col justify-center items-center">
                            <span className="material-symbols-outlined text-3xl">
                                kid_star
                            </span>
                            <p className="font-bold">프레임</p>
                        </div>
                        <div className="h-28 bg-orange-100 flex flex-col justify-center items-center">
                            <span className="material-symbols-outlined text-3xl">
                                <span className="material-symbols-outlined">
                                    title
                                </span>
                            </span>
                            <p className="font-bold">텍스트</p>
                        </div>
                        <div className="h-28 bg-orange-100 flex flex-col justify-center items-center">
                            <span className="material-symbols-outlined text-3xl">
                                <span className="material-symbols-outlined">
                                    volume_up
                                </span>
                            </span>
                            <p className="font-bold">오디오</p>
                        </div>
                    </div>
                    {/* 카테고리 선택에 따라 */}
                    <div className="w-4/5 flex flex-col items-center p-6 overflow-y-scroll">
                        <div className="w-full flex justify-start text-xl ">
                            <p>선택하지 않은 영상</p>
                        </div>

                        <div className="relative flex w-full my-2 p-2 border-2">
                            <img
                                className="w-16 h-12"
                                src="/src/assets/images/nothumb.png"
                                alt=""
                            />
                            <div className="ms-2">
                                <p className="font-bold">연쮸</p>
                                <p>0:48</p>
                            </div>
                            <span className="material-symbols-outlined text-xl absolute -top-3 -right-3 color-text-blue3">
                                add_circle
                            </span>
                            <span className="material-symbols-outlined text-xl absolute bottom-0 right-0 color-text-red3">
                                delete
                            </span>
                        </div>
                        <div className="relative flex w-full my-2 p-2 border-2">
                            <img
                                className="w-16 h-12"
                                src="/src/assets/images/nothumb.png"
                                alt=""
                            />
                            <div className="ms-2">
                                <p className="font-bold">유경</p>
                                <p>0:48</p>
                                <span className="material-symbols-outlined text-xl absolute -top-3 -right-3 color-text-blue3">
                                    add_circle
                                </span>
                            </div>
                        </div>
                        <div className="relative flex w-full my-2 p-2 border-2">
                            <img
                                className="w-16 h-12"
                                src="/src/assets/images/nothumb.png"
                                alt=""
                            />
                            <div className="ms-2">
                                <p className="font-bold">은수</p>
                                <p>0:48</p>
                                <span className="material-symbols-outlined text-xl absolute -top-3 -right-3 color-text-blue3">
                                    add_circle
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 우측부분 */}
                <div className="w-3/4 h-full editor-height bg-gray-50 flex flex-col justify-between">
                    <div className="w-full h-3/4 px-4 py-4 flex flex-col justify-center items-center">
                        <div className="movie-width flex justify-start items-center mt-0">
                            <p className="text-2xl">은쮸</p>
                        </div>
                        <img
                            className="bg-white border my-2"
                            style={{ width: '640px', height: '400px' }}
                            src="/src/assets/images/nothumb.png"
                        />
                    </div>
                    <div className="w-full h-1/4 bg-white border-2 flex justify-center items-center">
                        <div className="w-full flex items-center my-4">
                            <div className=" w-1/12 flex justify-center items-center">
                                <span className="material-symbols-outlined me-1 text-4xl">
                                    play_circle
                                </span>
                            </div>
                            <div className="w-11/12 flex items-center overflow-x-scroll">
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        value={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        value={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        value={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        value={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        value={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        value={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        value={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        value={50}
                                    />
                                </div>
                                <div className="w-28 flex flex-col justify-center mx-2">
                                    <img
                                        className="w-28"
                                        src="/src/assets/images/nothumb.png"
                                        alt=""
                                    />
                                    <p>선재</p>
                                    <input
                                        className="w-28"
                                        type="range"
                                        min={1}
                                        max={100}
                                        value={50}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
