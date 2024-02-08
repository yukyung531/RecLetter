import { ClipInfo } from '../types/type';
import { useRef, useState } from 'react';

interface VideoCardProp {
    selectVideo: React.MouseEventHandler<HTMLDivElement>;
    // getDuration: (clipId: number, duration: number) => void;
    props: ClipInfo;
}

export default function UnSelectedVideoCard({
    selectVideo,
    // getDuration,
    props,
}: VideoCardProp) {
    //clipId 문자열 변형
    const clipId: string = props.clipId + '';

    //video metadata
    const videoRef = useRef<HTMLVideoElement>(null);

    const [duration, setDuration] = useState<number>(-1);

    const metadataLoad = () => {
        if (videoRef.current) {
            setDuration(Math.floor(videoRef.current.duration));
            // getDuration(props.clipId, videoRef.current.duration);
        }
    };

    //hover시 class에 color-border-blue2 추가
    return (
        <div
            className="flex justify-between w-full my-2 p-2 border-2 hover:color-border-sublight"
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
        </div>
    );
}
