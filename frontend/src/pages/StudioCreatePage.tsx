import { BaseSyntheticEvent, useState } from 'react';
import AddMemberWindow from '../components/AddMemberWindow';
import { StudioMake } from '../types/type';
import moment from 'moment';
import { makeStudio } from '../api/studio';
import { httpStatusCode } from '../util/http-status';
import { useNavigate } from 'react-router-dom';

export default function StudioCreatePage() {
    const [isInviteActive, setIsInviteActive] = useState<boolean>(false);
    const [studioTitle, setStudioTitle] = useState<string>('');
    const navigate = useNavigate();
    const onPressAddMember = () => {
        setIsInviteActive(true);
    };

    const onPressCloseWindow = () => {
        setIsInviteActive(false);
    };

    const changeTitle = (e: BaseSyntheticEvent) => {
        setStudioTitle(e.target.value);
        console.log(moment().format('YYYY-MM-DDTHH:mm:ss'));
    };

    const makeOnClick = () => {
        const studioParameter: StudioMake = {
            studioTitle: studioTitle,
            expireDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
        };
        loadMakeStudioAPI(studioParameter);
    };

    const loadMakeStudioAPI = async (studioParameter: StudioMake) => {
        await makeStudio(studioParameter)
            .then((res) => {
                console.log(res);
                if (res.status === httpStatusCode.OK) {
                    console.log('방생성이 성공했습니다.');
                } else if (res.status === httpStatusCode.BADREQUEST) {
                    console.log('bad request');
                }
            })
            .catch((error) => {
                console.log('오류', error);
            });
    };

    return (
        <section className="relative section-top pt-20 mt-20 ml-16">
            {isInviteActive ? (
                <AddMemberWindow onClose={onPressCloseWindow} />
            ) : (
                <></>
            )}
            <div>
                <h5 className="text-3xl font-bold">스튜디오 제목</h5>
                <input
                    className="w-120 py-3 px-3 my-4 border-2 rounded text-xl"
                    type="text"
                    placeholder="Placeholder"
                    onChange={changeTitle}
                />
                <h5 className="text-3xl font-bold">마감 일자</h5>
                <input
                    className="w-120 py-3 px-3 my-4 border-2 rounded text-xl"
                    type="text"
                    placeholder="Placeholder"
                />
                <p
                    className="btn-cover color-bg-yellow2"
                    onClick={onPressAddMember}
                >
                    멤버추가
                </p>
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
                <div className="btn-cover color-bg-blue1" onClick={makeOnClick}>
                    스튜디오 생성
                </div>
            </div>
        </section>
    );
}
