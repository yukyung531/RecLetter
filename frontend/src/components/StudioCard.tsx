import { useEffect, useState } from 'react';
import { StudioInfo } from '../types/type';
import { enterChatting } from '../api/chat';
import { httpStatusCode } from '../util/http-status';

interface StudioCardProp {
    props: StudioInfo;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    editMode: boolean | null;
}

export default function StudioCard({
    props,
    onClick,
    editMode,
}: StudioCardProp) {
    const regex =
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

    //참여 여부
    let isUploadUi = (
        <p className="px-3 color-bg-blue3 text-center text-sm rounded-xl text-white">
            참여 완료
        </p>
    );
    if (!props.hasMyClip) {
        isUploadUi = (
            <p className="px-3 color-bg-subbold text-center text-sm rounded-xl text-white">
                미참여
            </p>
        );
    }

    const [selected, setSelected] = useState<boolean>(false);
    const [peopleNum, setPeopleNum] = useState<number>(0);
    const [videoCount, setVideoCount] = useState<number>(0);
    const studioId: string = props.studioId + '';

    const expireDate: Date = new Date(props.expireDate);
    const stickerUrl: string = props.thumbnailUrl;
    const stickerFrame: number = props.studioFrameId;

    useEffect(() => {
        const findPeopleNum = async () => {
            await enterChatting(studioId).then((res) => {
                if (res.status === httpStatusCode.OK) {
                    setPeopleNum(res.data.length);
                }
            });
        };
        findPeopleNum();
    }, []);
    useEffect(() => {
        if (editMode === false) {
            setSelected(false);
        }
    }, [editMode]);

    return (
        <div
            className="relative w-[23%] p-3 bg-white border rounded-lg flex flex-col mx-2 my-2 justify-start items-center cursor-pointer"
            id={studioId}
            onClick={(e) => {
                onClick(e);
                setSelected(!selected);
            }}
            style={selected ? { border: '1px solid #ffa9a9' } : {}}
        >
            <video
                className="w-full bg-black rounded-lg"
                style={{
                    aspectRatio: 16 / 9,
                    transform: `rotateY(180deg)`,
                }}
                src={props.thumbnailUrl}
                crossOrigin="anonymous"
                controlsList="nodownload"
            />
            {/*"https://d3kbsbmyfcnq5r.cloudfront.net/favicon.png" */}
            <div
                className="absolute w-full top-0 z-10 p-3"
                style={{
                    aspectRatio: 16 / 9,
                }}
            >
                {stickerUrl !== '' ? (
                    <img className="w-full" src={stickerUrl} alt="" />
                ) : (
                    <img
                        className="w-full"
                        src="/src/assets/images/nothumb.png"
                        alt=""
                    />
                )}
            </div>
            {props.studioStickerUrl.match(regex) ? (
                <img
                    src={props.studioStickerUrl}
                    className="absolute top-0 lef-0 z-20 p-3"
                    crossOrigin="anonymous"
                    style={{
                        width: '100%',
                        aspectRatio: 16 / 9,
                    }}
                    alt=""
                />
            ) : (
                <></>
            )}
            <div className="absolute w-full h-full flex items-center justify-center z-20">
                {props.studioStatus === 'FAIL' ? (
                    <img
                        className=" opacity-95"
                        src="/src/assets/icons/warning.png"
                        alt=""
                    />
                ) : (
                    <></>
                )}
            </div>

            <div
                className="absolute p-3 w-full top-0 z-10"
                style={{
                    aspectRatio: 16 / 9,
                }}
            >
                {stickerFrame ? (
                    <img
                        className="z-0"
                        src={'/src/assets/frames/frame' + stickerFrame + '.png'}
                        alt=""
                    />
                ) : (
                    <></>
                )}
            </div>
            <div className="flex justify-center items-center w-full text-xl">
                {editMode ? (
                    <div className="absolute min-w-4 w-4 h-4 top-3 left-3 bg-white -start-3 flex justify-center items-center border rounded-full color-border-darkgray z-10">
                        {selected && (
                            <div className="w-2 h-2 rounded-full color-bg-main"></div>
                        )}
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="flex items-center justify-between w-full mt-2">
                    <div className="text-xl flex items-center">
                        {props.isStudioOwner ? (
                            <img
                                className="w-4 h-4 me-2"
                                src="/src/assets/icons/owner-crown.png"
                            />
                        ) : (
                            <></>
                        )}
                        <p>{props.studioTitle}</p>
                    </div>

                    {/*<p className="w-fit text-2xl">*/}
                    {/*    D-*/}
                    {/*    {Math.floor((expireDate.getTime() - Date.now()) /*/}
                    {/*        (1000 * 60 * 60 * 24))}*/}
                    {/*</p>*/}
                    {Math.floor(
                        (expireDate.getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24)
                    ) < 1 ? (
                        <p className="w-fit text-2xl color-text-main">D- Day</p>
                    ) : (
                        <p className="w-fit text-2xl">
                            D-
                            {Math.floor(
                                (expireDate.getTime() - Date.now()) /
                                    (1000 * 60 * 60 * 24)
                            )}
                        </p>
                    )}
                </div>
            </div>
            <div className="w-full flex justify-between">
                <div className="flex">
                    <div className="flex items-center">
                        <img
                            className="w-[15px] h-3"
                            src="/src/assets/icons/group.png"
                            alt=""
                        />
                        <p className="mx-1">{props.attendMember}</p>
                    </div>
                    <div className="mx-2 flex items-center">
                        <img
                            className="w-3 h-3"
                            src="/src/assets/icons/message.png"
                            alt=""
                        />
                        <p className="mx-1">{props.videoCount}</p>
                    </div>
                </div>
                <div>{isUploadUi}</div>
            </div>
        </div>
    );
}
