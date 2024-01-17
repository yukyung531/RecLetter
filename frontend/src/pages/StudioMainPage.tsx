export default function StudioMainPage() {
    return (
        <section className="relative section-top pt-16 ">
            <div className="h-20 w-full px-12 bg-black text-white flex justify-between items-center">
                <div className="flex items-center">
                    <span className="material-symbols-outlined">
                        arrow_back_ios
                    </span>
                    <p className="text-3xl">studio1</p>
                    <div className="ml-28" />
                    <span className="material-symbols-outlined mx-2 text-3xl">
                        edit
                    </span>
                    <span className="material-symbols-outlined mx-2 text-3xl">
                        group_add
                    </span>
                </div>
                <a className="btn-cover color-bg-red3">영상편지 완성하기</a>
            </div>

            {/* 중앙 섹션 */}
            <div className="flex w-full">
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
                                checklist
                            </span>
                            <p className="font-bold">관리</p>
                        </div>
                    </div>
                    {/* 카테고리 선택에 따라 */}
                    <div className="w-4/5 flex flex-col items-center p-6 overflow-y-scroll">
                        <div className="w-full flex justify-start text-xl ">
                            <p>선택된 영상</p>
                        </div>
                        <div className="px-6 my-2 flex items-center justify-center border-2 rounded-md color-border-blue1 cursor-pointer">
                            <span className="material-symbols-outlined text-4xl color-text-blue3">
                                arrow_right
                            </span>
                            <p className="text-xl font-bold color-text-blue3">
                                전체 편지 자동 재생
                            </p>
                        </div>
                        <div className="flex w-full my-2 p-2 border-2 color-border-blue2">
                            <img
                                className="w-16 h-12"
                                src="/src/assets/images/nothumb.png"
                                alt=""
                            />
                            <div className="ms-2">
                                <p className="font-bold">연쮸</p>
                                <p>0:48</p>
                            </div>
                        </div>
                        <div className="flex w-full my-2 p-2 border-2">
                            <img
                                className="w-16 h-12"
                                src="/src/assets/images/nothumb.png"
                                alt=""
                            />
                            <div className="ms-2">
                                <p className="font-bold">유경</p>
                                <p>0:48</p>
                            </div>
                        </div>
                        <div className="flex w-full my-2 p-2 border-2">
                            <img
                                className="w-16 h-12"
                                src="/src/assets/images/nothumb.png"
                                alt=""
                            />
                            <div className="ms-2">
                                <p className="font-bold">은수</p>
                                <p>0:48</p>
                            </div>
                        </div>
                        <div className="w-full flex justify-start text-xl ">
                            <p>선택되지 않은 영상</p>
                        </div>
                        <div className="flex w-full my-2 p-2 border-2">
                            <img
                                className="w-16 h-12"
                                src="/src/assets/images/nothumb.png"
                                alt=""
                            />
                            <div className="ms-2">
                                <p className="font-bold">뗜재</p>
                                <p>0:48</p>
                            </div>
                        </div>
                        <div className="flex w-full my-2 p-2 border-2">
                            <img
                                className="w-16 h-12"
                                src="/src/assets/images/nothumb.png"
                                alt=""
                            />
                            <div className="ms-2">
                                <p className="font-bold">때운</p>
                                <p>0:48</p>
                            </div>
                        </div>
                        <div className="flex w-full my-2 p-2 border-2">
                            <img
                                className="w-16 h-12"
                                src="/src/assets/images/nothumb.png"
                                alt=""
                            />
                            <div className="ms-2">
                                <p className="font-bold">하용</p>
                                <p>0:48</p>
                            </div>
                        </div>
                        <div className="flex w-full my-2 p-2 border-2">
                            <img
                                className="w-16 h-12"
                                src="/src/assets/images/nothumb.png"
                                alt=""
                            />
                            <div className="ms-2">
                                <p className="font-bold">하용</p>
                                <p>0:48</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 우측부분 */}
                <div className="w-3/4 editor-height bg-gray-50 flex justify-between">
                    <div className="w-3/4 px-4 py-4 flex flex-col justify-center items-center">
                        <div className="movie-width flex justify-start items-center">
                            <p className="text-2xl">은쮸</p>
                        </div>
                        <img
                            className="bg-white border my-2"
                            style={{ width: '720px', height: '450px' }}
                            src="/src/assets/images/nothumb.png"
                        />
                        <div className="w-full flex justify-center items-center my-4">
                            <span className="material-symbols-outlined me-1 text-4xl">
                                play_circle
                            </span>
                            <span className="material-symbols-outlined me-1 text-4xl">
                                stop_circle
                            </span>
                            <div className="w-full h-2 bg-black"></div>
                        </div>
                    </div>

                    {/* (영상 리스트, 참가자 관리) */}
                    <div className="w-1/4 bg-slate-100 p-2">
                        <div className="w-full px-2 flex flex-col justify-center items-center">
                            <a
                                href="/cliprecode"
                                className="w-full h-24 mx-4 my-2 color-bg-blue3 text-white text-xl flex flex-col justify-center items-center border rounded-md"
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    photo_camera
                                </span>
                                <p>새 영상 촬영하기</p>
                            </a>
                            <a
                                href="/lettermake"
                                className="w-full h-24 mx-4 my-2 color-border-blue3 color-text-blue3 text-xl flex flex-col justify-center items-center border rounded-md"
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    theaters
                                </span>
                                <p>영상편지 편집하기</p>
                            </a>
                        </div>
                        {/* 할당된 영상 리스트 */}
                        <div className="px-4">
                            <div className="w-full flex justify-start text-xl ">
                                <p>나의 영상</p>
                            </div>
                            <div className="flex w-full my-2 p-2 border-2 items-center">
                                <img
                                    className="w-16 h-12"
                                    src="/src/assets/images/nothumb.png"
                                    alt=""
                                />
                                <div className="ms-2">
                                    <p className="font-bold">뗜재</p>
                                    <p>0:48</p>
                                </div>
                                <div className="w-full flex flex-col items-end me-2">
                                    <p className="w-14 my-0.5 px-3 text-center color-bg-red2 text-white">
                                        편집
                                    </p>
                                    <p className="w-14 my-0.5 px-3 text-center color-bg-black text-white">
                                        삭제
                                    </p>
                                </div>
                            </div>
                            <div className="flex w-full my-2 p-2 border-2 items-center">
                                <img
                                    className="w-16 h-12"
                                    src="/src/assets/images/nothumb.png"
                                    alt=""
                                />
                                <div className="ms-2">
                                    <p className="font-bold">유꼉</p>
                                    <p>0:48</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
