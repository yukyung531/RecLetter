import { backgroundImage } from 'html2canvas/dist/types/css/property-descriptors/background-image';
import { StudioInfo } from '../types/type';
import { useState } from 'react';

interface StudioCardProp {
    props: StudioInfo;
    onClick: React.MouseEventHandler<HTMLParagraphElement>;
}

export default function StudioFinishCard({ props, onClick }: StudioCardProp) {
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
    const studioId: string = props.studioId + '';

    const regex =
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

    const expireDate: Date = new Date(props.expireDate);

    const stickerUrl: string = props.thumbnailUrl;
    const stickerFrame: number = props.studioFrameId;

    const [isHovered, setHovered] = useState(false);

    const encodingElement = () => {
        if (props.studioStatus === 'ENCODING') {
            return (
                <div
                    className="relative w-[23%] box-border flex flex-col mx-2 mt-4 justify-start items-center cursor-pointer"
                    id={studioId}
                    style={{ aspectRatio: 1 / 1 }}
                >
                    <img
                        className="absolute w-full bottom-0 -z-20"
                        src="/src/assets/images/encoding-video.png"
                        alt=""
                    />
                    <div className="relative flex w-full h-full flex-col justify-end pb-8 px-2">
                        <div className="absolute bottom-0 flex flex-col justify-between w-full z-20 p-2">
                            <div className="text-2xl flex items-center -ms-3 mb-1 text-center justify-center">
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
                            <div className="flex justify-between w-full ps-2 px-4">
                                <p className="text-base">인코딩 중입니다...</p>

                                <p className="text-xl color-text-darkgray"></p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (props.studioStatus === 'COMPLETE') {
            return (
                <div
                    className="relative w-[23%] box-border p-3 flex flex-col mx-2 my-2 justify-start items-center cursor-pointer mt-4"
                    id={studioId}
                    onClick={onClick}
                    style={{ aspectRatio: 1 / 1 }}
                    onMouseEnter={() => {
                        setHovered(true);
                    }}
                    onMouseLeave={() => setHovered(false)}
                >
                    <img
                        className="absolute w-full bottom-0 -z-20"
                        src="/src/assets/images/finish-video-back.png"
                        alt=""
                    />

                    <div
                        className={`relative w-full top-1/3 z-10 border rounded-xl ${
                            isHovered === true ? 'letter-animation' : ''
                        }`}
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
                        <div
                            className="absolute w-full top-0"
                            style={{
                                aspectRatio: 16 / 9,
                            }}
                        >
                            {props.studioStickerUrl.match(regex) ? (
                                <img
                                    src={props.studioStickerUrl}
                                    className="absolute top-0 lef-0 z-20"
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
                        </div>
                        <div
                            className="absolute w-full top-0"
                            style={{
                                aspectRatio: 16 / 9,
                            }}
                        >
                            {stickerFrame ? (
                                <img
                                    src={
                                        '/src/assets/frames/frame' +
                                        stickerFrame +
                                        '.png'
                                    }
                                    alt=""
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>

                    <div
                        className="absolute flex w-full h-full flex-col justify-end"
                        style={{}}
                    >
                        <img
                            className="absolute w-full bottom-0 z-10"
                            src="/src/assets/images/finish-video-front.png"
                            alt=""
                        />
                        <div className="flex flex-col justify-between w-full mt-2 z-30 p-2">
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

                            <div className="w-full flex justify-between">
                                <p></p>
                                {Math.floor(
                                    (expireDate.getTime() - Date.now()) /
                                        (1000 * 60 * 60 * 24)
                                ) > 0 ? (
                                    <p className="text-xl color-text-darkgray">
                                        보관 기한 D-
                                        {Math.floor(
                                            (expireDate.getTime() -
                                                Date.now()) /
                                                (1000 * 60 * 60 * 24)
                                        )}
                                    </p>
                                ) : (
                                    <p className="text-xl color-text-darkgray">
                                        보관 기한 만료
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };
    return <>{encodingElement()}</>;
}
