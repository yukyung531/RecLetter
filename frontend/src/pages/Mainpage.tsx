export default function Mainpage() {
    return (
        <div className="relative color-bg-yellow1">
            <div className="color-bg-black h-20 absolute top-0 w-full z-20 flex justify-around items-center text-white">
                <p>monofilm</p>
                <p>monofilm</p>
                <p>monofilm</p>
            </div>
            <img
                className="base-height absolute w-48 left-20 z-10 overflow-y-auto"
                src="/src/assets/images/leftframe.png"
                alt=""
            />
            <section className="section-center ">
                <div className="flex flex-col justify-center items-center">
                    <p className="text-3xl mb-4">
                        영상으로 전하는 우리의 마음, 레크레터
                    </p>
                    <img
                        className=" object-cover"
                        src="/src/assets/images/logo.png"
                        alt=""
                    />
                    <a
                        href="./login"
                        className="w-60 bg-white cursor-pointer my-6 p-4 flex justify-center items-center border border-black rounded-md"
                    >
                        <span className="material-symbols-outlined">login</span>
                        <p className="text-3xl mx-4">시작하기</p>
                    </a>
                </div>
            </section>
            <div className="color-bg-black h-20 absolute bottom-0 w-full z-20 flex justify-around items-center text-white"></div>
        </div>
    );
}
