import { BaseSyntheticEvent, useEffect, useState } from 'react';
import AddMemberWindow from '../components/AddMemberWindow';
import { FrameType, StudioMake } from '../types/type';
import moment from 'moment';
import { makeStudio } from '../api/studio';
import { httpStatusCode } from '../util/http-status';
import { useNavigate } from 'react-router-dom';
import { getTemplate } from '../api/template';

export default function StudioCreatePage() {
    const [isInviteActive, setIsInviteActive] = useState<boolean>(false);
    const [studioTitle, setStudioTitle] = useState<string>('');
    const [framelist, setFrameList] = useState<FrameType[]>([]);
    const [frame, setFrame] = useState<number>(1);
    const navigate = useNavigate();

    useEffect(() => {
        loadFrameTemplateAPI();
    }, []);

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
            studioFrameId: frame,
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

    /** GET 프레임 템플릿 리스트 조회 */
    const loadFrameTemplateAPI = async () => {
        await getTemplate().then((res) => {
            if (res.status === httpStatusCode.OK) {
                setFrameList(res.data.frameTemplate);
                console.log(res.data.frameTemplate);
            }
        });
    };
    const selectFrame = (frameId: number) => {
        setFrame(frameId);
        console.log(frameId);
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
                    {framelist.map((item, index) => {
                        return (
                            <div
                                key={'frameId :' + index}
                                className="flex flex-col justify-center items-center"
                                onClick={() => {
                                    selectFrame(item.frameId);
                                }}
                            >
                                <img
                                    className="image-select-size"
                                    src="/src/assets/images/nothumb.png"
                                />
                                <p>{item.frameTitle}</p>
                            </div>
                        );
                    })}
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
