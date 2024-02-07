import { ClipInfo } from '../types/type';
import { useRef, useState } from 'react';

interface VideoCardProp {
    onClick?: React.MouseEventHandler<HTMLParagraphElement>;
    onDelete?: React.MouseEventHandler<HTMLParagraphElement>;
    selectVideo: React.MouseEventHandler<HTMLDivElement>;
    props: ClipInfo;
    presentUser: string;
    selectedClip: ClipInfo;
}

export default function VideoCard({
    onClick,
    onDelete,
    selectVideo,
    props,
    presentUser,
    selectedClip,
}: VideoCardProp) {
    //userId에 따라 편집, 삭제 기능 활성화
    const userId = presentUser;

    //clipId 문자열 변형
    const clipId: string = props.clipId + '';

    //video metadata
    const videoRef = useRef<HTMLVideoElement>(null);

    const [duration, setDuration] = useState<number>(-1);

    const metadataLoad = () => {
        if (videoRef.current) {
            setDuration(Math.floor(videoRef.current.duration));
        }
    };

    //hover시 class에 color-border-blue2 추가
    return (
        <div
            className={`flex justify-between w-full my-2 p-2 border-2 cursor-pointer ${
                selectedClip && selectedClip.clipId === props.clipId
                    ? 'border-[#FF777F]'
                    : ''
            } hover:color-border-sublight`}
            id={clipId}
            onClick={selectVideo}
        >
            <div className="flex justify-center items-center">
                <video
                    className="w-16 h-12 bg-gray-200"
                    src={props.clipUrl}
                    ref={videoRef}
                    crossOrigin="anonymous"
                    preload="metadata"
                    onLoadedData={metadataLoad}
                    style={{ transform: `rotateY(180deg)` }}
                />
                {/* <img
                className="w-16 h-12"
                src={props.clipThumbnail}
                alt={props.clipTitle}
            /> */}
                <div className="mx-2">
                    <p className="font-bold w-full">{props.clipTitle}</p>
                    <p>
                        {duration >= 60 ? 1 : 0} :{' '}
                        {duration % 60 < 10
                            ? '0' + (duration % 60)
                            : duration % 60}
                    </p>
                </div>
            </div>

            {userId === props.clipOwner ? (
                <div className="me-2">
                    {/* {onClick ? (
                        <p
                            className="w-14 my-0.5 px-3 text-center color-bg-red2 text-white"
                            onClick={onClick}
                        >
                            편집
                        </p>
                    ) : (
                        <></>
                    )} */}
                    {onDelete ? (
                        <p
                            className="w-14 my-0.5 px-3 text-center color-bg-black text-white"
                            onClick={onDelete}
                        >
                            삭제
                        </p>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
