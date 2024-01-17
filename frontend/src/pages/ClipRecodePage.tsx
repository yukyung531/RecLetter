export default function ClipRecodePage() {
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
                    href="/clipedit"
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
                            <p className="font-bold">스크립트</p>
                        </div>
                        <div className="h-28 bg-orange-100 flex flex-col justify-center items-center">
                            <span className="material-symbols-outlined text-3xl">
                                <span className="material-symbols-outlined">
                                    settings
                                </span>
                            </span>
                            <p className="font-bold">설정</p>
                        </div>
                    </div>
                    {/* 카테고리 선택에 따라 */}
                    <div className="w-4/5 flex flex-col items-center p-6 overflow-y-scroll">
                        <div className="w-full flex justify-start text-xl ">
                            <p>선택하지 않은 영상</p>
                        </div>

                        <div className="relative flex w-full my-2 p-2 border-2 color-border-blue2">
                            <img
                                className="w-16 h-12"
                                src="/src/assets/images/nothumb.png"
                                alt=""
                            />
                            <div className="ms-2">
                                <p className="font-bold">연쮸</p>
                                <p>0:48</p>
                            </div>
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
                            </div>
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
                                <p className="font-bold">은수</p>
                                <p>0:48</p>
                            </div>
                            <span className="material-symbols-outlined text-xl absolute bottom-0 right-0 color-text-red3">
                                delete
                            </span>
                        </div>
                    </div>
                </div>
                {/* 우측부분 */}
                <div className="w-3/4 editor-height bg-gray-50 flex justify-between">
                    <div className="w-full px-4 py-4 flex flex-col justify-center items-center">
                        <div className="movie-width flex justify-start items-center mt-0">
                            <p className="text-2xl">은쮸</p>
                        </div>
                        <input
                            className="my-3 py-3 rounded-full border-2 border-black movie-width text-center text-xl"
                            type="text"
                            value="스크립트 입니다. 하바바바바바"
                        />
                        <img
                            className="bg-white border my-2"
                            style={{ width: '560px', height: '350px' }}
                            src="/src/assets/images/nothumb.png"
                        />
                        <div className="w-full flex flex-col justify-center items-center my-4">
                            <div>
                                <span className="material-symbols-outlined me-1 text-4xl">
                                    play_circle
                                </span>
                                <span className="material-symbols-outlined me-1 text-4xl color-text-red3">
                                    radio_button_checked
                                </span>
                                <span className="material-symbols-outlined me-1 text-4xl">
                                    stop_circle
                                </span>
                            </div>
                            <div className="w-3/4 h-2 bg-black"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
