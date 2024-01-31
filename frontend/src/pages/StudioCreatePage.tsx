import { BaseSyntheticEvent, useEffect, useState } from 'react';
import AddMemberWindow from '../components/AddMemberWindow';
import { FrameType, StudioMake } from '../types/type';
import moment from 'moment';
import { makeStudio } from '../api/studio';
import { httpStatusCode } from '../util/http-status';
import { useNavigate } from 'react-router-dom';
import { getTemplate } from '../api/template';
import ReactDatePicker from 'react-datepicker';

export default function StudioCreatePage() {
    const [isInviteActive, setIsInviteActive] = useState<boolean>(false);
    const [studioTitle, setStudioTitle] = useState<string>('');
    const [framelist, setFrameList] = useState<FrameType[]>([]);
    const [frame, setFrame] = useState<number>(1);
    // const [startDate, setStartDate] = useState<Date | null>(new Date());
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
    };

    const makeOnClick = () => {
        moment().format('YYYY-MM-DDTHH:mm:ss');
        let time = moment().add(13, 'days').format().substring(0, 19);
        const studioParameter: StudioMake = {
            studioTitle: studioTitle,
            expireDate: time,
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
                    navigate('/studiolist');
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
        <section className="relative w-full flex flex-col justify-center items-center pt-12 mt-12">
            {isInviteActive ? (
                <AddMemberWindow onClose={onPressCloseWindow} />
            ) : (
                <></>
            )}
            <div className="w-3/4 flex flex-col justify-center items-center">
                <div className="flex w-full justify-between">
                    <div>
                        <h5 className="text-2xl font-bold">스튜디오 제목</h5>
                        <input
                            className="w-128 py-2 px-3 my-4 border-2 rounded-xl text-xl"
                            type="text"
                            placeholder="Placeholder"
                            onChange={changeTitle}
                        />
                    </div>
                    <div>
                        <h5 className="text-2xl font-bold">
                            마감일자 (최대 14일 뒤)
                        </h5>
                        <input
                            className="w-105 py-2 px-3 my-4 border-2 rounded-xl text-xl"
                            type="number"
                            max={14}
                            min={1}
                            placeholder="Placeholder"
                        />
                        {/* <p
                            className="btn-cover color-bg-yellow2"
                            onClick={onPressAddMember}
                        >
                            멤버추가
                        </p> */}
                    </div>
                </div>
                <div>
                    <h5 className="text-2xl font-bold mt-8">영상 프레임</h5>
                    <div className="flex flex-wrap h-96 overflow-y-scroll">
                        {framelist.map((item, index) => {
                            const frameSrc =
                                '/src/assets/frames/frame' +
                                item.frameId +
                                '.png';
                            return (
                                <div
                                    key={'frameId :' + index}
                                    className="flex flex-col justify-center items-center py-1 rounded-lg"
                                    onClick={() => {
                                        selectFrame(item.frameId);
                                    }}
                                    style={{
                                        border:
                                            index + 1 === frame
                                                ? '2px solid #ff777f'
                                                : '2px solid white',
                                    }}
                                >
                                    <img
                                        className="image-select-size rounded-lg"
                                        src={frameSrc}
                                    />
                                    <p>{item.frameTitle}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div
                    className="w-72 w- py-3 my-12 text-center color-bg-main text-xl cursor-pointer text-white rounded-lg hover:color-bg-subbold"
                    onClick={makeOnClick}
                >
                    스튜디오 생성
                </div>
            </div>
        </section>
    );
}
