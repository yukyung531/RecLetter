export default function ClipEditPage() {
    return (
        <section className="relative section-top">
            <div className="h-20 w-full px-12 color-text-black flex justify-between items-center">
                <div className="flex items-center">
                    <span className="material-symbols-outlined">
                        arrow_back_ios
                    </span>
                    <input
                        className="text-2xl border-2 pl-2"
                        type="text"
                        value="제목을 입력해주세요"
                    />
                    <div className="ml-20" />
                    <span className="material-symbols-outlined mx-2 text-3xl">
                        edit
                    </span>
                    <span className="material-symbols-outlined mx-2 text-3xl">
                        group_add
                    </span>
                </div>
                <a
                    href="/studiomain"
                    className="btn-cover color-bg-red3 text-white"
                >
                    저장하기
                </a>
            </div>

            {/* 중앙 섹션 */}
            <div className="flex w-full">
                {/* 좌측부분 */}
                <div className="w-1/4 editor-height flex">
                    {/* 카테고리 */}
                    <div className="w-1/5 ">
                        <div className="h-28 bg-orange-100 flex flex-col justify-center items-center categori-selected">
                            <span className="material-symbols-outlined text-3xl">
                                settings
                            </span>
                            <p className="font-bold">설정</p>
                        </div>
                    </div>
                    {/* 카테고리 선택에 따라 */}
                    <div className="w-4/5 flex flex-col items-center p-6 overflow-y-scroll">
                        <div className="w-full flex justify-start text-xl ">
                            <p>사용할 구간 선택</p>
                        </div>
                        <div className="my-2 flex justify-center items-center">
                            <input
                                className="w-16 p-2 border border-black rounded text-center"
                                value="0:00"
                            ></input>
                            <p className="mx-4">~</p>
                            <input
                                className="w-16 p-2 border border-black rounded text-center"
                                value="0:59"
                            ></input>
                        </div>

                        <div className="w-full flex justify-start text-xl ">
                            <p>서브 텍스트 입력</p>
                        </div>
                        <input
                            className="w-56 my-2 p-2 border border-black rounded"
                            placeholder="텍스트를 입력해주세요."
                        ></input>
                    </div>
                </div>
                {/* 우측부분 */}
                <div className="w-3/4 editor-height bg-gray-50 flex justify-between">
                    <div className="w-full px-4 py-4 flex flex-col justify-center items-center">
                        <img
                            className="bg-white border my-2"
                            style={{ width: '720px', height: '450px' }}
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
