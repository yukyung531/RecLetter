import { backgroundImage } from 'html2canvas/dist/types/css/property-descriptors/background-image';
import { StudioInfo } from '../types/type';

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

    const expireDate: Date = new Date(props.expireDate);

    const stickerUrl: string = props.thumbnailUrl;
    const stickerFrame: number = props.studioFrameId;

    return (
        <div
            className="relative w-1/5 p-3 flex flex-col mx-2 my-2 justify-start items-center cursor-pointer"
            id={studioId}
            onClick={onClick}
        >
            <img
                className="absolute bottom-0 -z-20"
                src="/src/assets/images/finish-video-back.png"
                alt=""
            />
            <div className="relative z-10 bottom-1/2 border rounded-xl hover:letter-animation">
                <img
                    className="w-full  rounded-lg "
                    style={{
                        aspectRatio: 16 / 9,
                    }}
                    src="/src/assets/images/nothumb.png"
                />
                <div
                    className="absolute w-full top-0"
                    style={{
                        aspectRatio: 16 / 9,
                    }}
                >
                    {stickerUrl !== '' ? (
                        <img src={stickerUrl} alt="" />
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
                className="absolute flex w-full h-full flex-col justify-center"
                style={{}}
            >
                <img
                    className="absolute bottom-0 z-10"
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
                        <p className="text-xl color-text-darkgray">
                            ~
                            {Math.floor(
                                (expireDate.getTime() - Date.now()) /
                                    (1000 * 60 * 60 * 24)
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
