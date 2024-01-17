export default function StudioListPage() {
    return (
        <section className="relative section-top pt-10 mt-16 ml-8">
            <ul className="w-full flex flex-col">
                <li className="text-2xl">
                    <p className="font-bold">내가 생성한 스튜디오</p>
                    <div className="flex my-4">
                        <a
                            href="/create"
                            className="border border-dotted border-4 border-gray-600 image-select-size flex items-center justify-center"
                        >
                            + 방 생성
                        </a>
                        <div className="relative flex flex-col justify-around items-center">
                            <p className="absolute px-3 top-4 right-4 bg-red-500 text-center text-lg border rounded-xl text-white">
                                미 참여
                            </p>
                            <img
                                className="image-select-size"
                                src="/src/assets/images/nothumb.png"
                            />
                            <div className="flex justify-around w-full px-4">
                                <div className="flex items-center justify-center">
                                    <p className="w-2 h-2 bg-yellow-300 rounded-full mx-1"></p>
                                    studio2
                                </div>
                                <p>|</p>
                                <p>D-8</p>
                            </div>
                        </div>
                        <div className="relative flex flex-col justify-around items-center">
                            <p className="absolute px-3 top-4 right-4 bg-green-500 text-center text-lg border rounded-xl text-white">
                                참여 완료
                            </p>
                            <img
                                className="image-select-size"
                                src="/src/assets/images/nothumb.png"
                            />
                            <div className="flex justify-around w-full px-4">
                                <div className="flex items-center justify-center">
                                    <p className="w-2 h-2 bg-green-500 rounded-full mx-1"></p>
                                    studio3
                                </div>
                                <p>|</p>
                                <p>D-4</p>
                            </div>
                        </div>
                    </div>
                </li>
                <li className="text-2xl">
                    <p className="font-bold">참여중인 스튜디오</p>
                    <div className="flex my-4">
                        <div className="relative flex flex-col justify-around items-center">
                            <p className="absolute px-3 top-4 right-4 bg-green-500 text-center text-lg border rounded-xl text-white">
                                참여 완료
                            </p>
                            <img
                                className="image-select-size"
                                src="/src/assets/images/nothumb.png"
                            />
                            <div className="flex justify-around w-full px-4">
                                <div className="flex items-center justify-center">
                                    studio2
                                </div>
                                <p>|</p>
                                <p>D-8</p>
                            </div>
                        </div>
                        <div className="relative flex flex-col justify-around items-center">
                            <p className="absolute px-3 top-4 right-4 bg-green-500 text-center text-lg border rounded-xl text-white">
                                참여 완료
                            </p>
                            <img
                                className="image-select-size"
                                src="/src/assets/images/nothumb.png"
                            />
                            <div className="flex justify-around w-full px-4">
                                <div className="flex items-center justify-center">
                                    studio3
                                </div>
                                <p>|</p>
                                <p>D-4</p>
                            </div>
                        </div>
                    </div>
                </li>
                <li className="text-2xl">
                    <p className="font-bold">완성된 비디오</p>
                    <div className="flex my-4">
                        <div className="relative flex flex-col justify-around items-center">
                            <img
                                className="image-select-size"
                                src="/src/assets/images/nothumb.png"
                            />
                            <div className="flex justify-around w-full px-4">
                                <div className="flex items-center justify-center">
                                    studio2
                                </div>
                                <p>|</p>
                                <p>D-4</p>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
    );
}
