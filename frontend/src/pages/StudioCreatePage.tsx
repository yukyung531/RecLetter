import { useState } from "react";
import AddMemberWindow from "../components/AddMemberWindow";

export default function StudioCreatePage() {

    const [isInviteActive, setIsInviteActive] = useState<boolean>(false);

    const onPressAddMember = () => {
        setIsInviteActive(true);
    }

    const onPressCloseWindow = () => {
        setIsInviteActive(false);
    }

    return (
        <section className="relative section-top pt-20 mt-20 ml-16">
            {isInviteActive ? <AddMemberWindow onClose={onPressCloseWindow}/> : <></>}
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
                <p className="btn-cover color-bg-yellow2" onClick={onPressAddMember}>멤버추가</p>
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
