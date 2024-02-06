import { ClipInfo } from '../types/type';
import { useRef } from 'react';

interface Prop {
    clip: ClipInfo;
    unselectClip: React.MouseEventHandler<HTMLButtonElement>;
    changeVolume: React.ChangeEventHandler<HTMLInputElement>;
    getDuration: (clipId: number, duration: number) => void;
}

export default function SelectedVideoCard({
    clip,
    unselectClip,
    changeVolume,
    getDuration,
}: Prop) {
    //video metadata
    const videoRef = useRef<HTMLVideoElement>(null);

    const metadataLoad = () => {
        if (videoRef.current) {
            getDuration(clip.clipId, videoRef.current.duration);
        }
    };
    return (
        <>
            <div className="w-28 flex flex-col justify-center mx-2">
                <button onClick={unselectClip}>선택 취소</button>
                <video
                    src={clip.clipUrl}
                    style={{ transform: `rotateY(180deg)` }}
                    crossOrigin="anonymous"
                    preload="metadata"
                    ref={videoRef}
                    onLoadedData={metadataLoad}
                />
                <p>{clip.clipTitle}</p>
                <input
                    className="w-28"
                    type="range"
                    min={1}
                    max={100}
                    defaultValue={clip.clipVolume}
                    onChange={changeVolume}
                />
            </div>
        </>
    );
}
