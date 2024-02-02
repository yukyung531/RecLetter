import { ClipInfo } from '../types/type';
import { useRef, useState } from 'react';

interface VideoCardProp {
    onClick?: React.MouseEventHandler<HTMLParagraphElement>;
    onDelete?: React.MouseEventHandler<HTMLParagraphElement>;
    selectVideo: React.MouseEventHandler<HTMLDivElement>;
    props: ClipInfo;
    presentUser: string;
}

export default function VideoCard({
    onClick,
    onDelete,
    selectVideo,
    props,
    presentUser,
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
            console.log(videoRef.current.duration);
            setDuration(videoRef.current.duration);
        }
    };

    //hover시 class에 color-border-blue2 추가
    return (
        <div
            className="flex w-full my-2 p-2 border-2 hover:border-[#65a6f2]"
            id={clipId}
            onClick={selectVideo}
        >
            <video
                src={props.clipUrl}
                style={{ display: 'none' }}
                ref={videoRef}
                crossOrigin="anonymous"
                preload="metadata"
                onLoadedData={metadataLoad}
            />
            <img
                className="w-16 h-12"
                src={props.clipThumbnail}
                alt={props.clipTitle}
            />
            <div className="ms-2">
                <p className="font-bold w-9">{props.clipTitle}</p>
                <p>
                    {duration >= 60 ? 1 : 0} :{' '}
                    {duration % 60 < 10 ? '0' + (duration % 60) : duration % 60}
                </p>
            </div>
            {userId === props.clipOwner ? (
                <div className="w-full flex flex-col items-end me-2">
                    {onClick ? (
                        <p
                            className="w-14 my-0.5 px-3 text-center color-bg-red2 text-white"
                            onClick={onClick}
                        >
                            편집
                        </p>
                    ) : (
                        <></>
                    )}
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
