import { ClipInfo } from '../types/type';
import { useRef } from 'react';

interface Prop {
    clip: ClipInfo;
    unselectClip: React.MouseEventHandler<HTMLButtonElement>;
    changeVolume: React.ChangeEventHandler<HTMLInputElement>;
    // getDuration: (clipId: number, duration: number) => void;
    propVideoRef: React.RefObject<HTMLVideoElement>;
    percent: number;
    selectCard: React.MouseEventHandler<HTMLDivElement>;
}

export default function SelectedVideoCard({
    clip,
    unselectClip,
    changeVolume,
    // getDuration,
    propVideoRef,
    percent,
    selectCard,
}: Prop) {
    //video metadata
    const videoRef = useRef<HTMLVideoElement>(null);

    const progressBar = useRef<HTMLDivElement>(null);

    const metadataLoad = () => {
        // if (videoRef.current) {
        //     getDuration(clip.clipId, videoRef.current.duration);
        // }
    };

    return (
        <>
            <div
                className={`relative w-28 flex flex-col justify-center mx-2`}
                onClick={selectCard}
            >
                {propVideoRef.current &&
                propVideoRef.current.src === clip.clipUrl ? (
                    <div
                        className={`w-[2px] h-full absolute bg-red-500 z-10`}
                        ref={progressBar}
                        style={{ left: percent * 112 }}
                    ></div>
                ) : (
                    <></>
                )}
                <button
                    className="absolute w-6 h-6 -right-2 -top-2 color-bg-main rounded-full z-10 flex justify-center items-center text-white"
                    onClick={unselectClip}
                >
                    -
                </button>
                <video
                    src={clip.clipUrl}
                    style={{ transform: `rotateY(180deg)` }}
                    crossOrigin="anonymous"
                    preload="metadata"
                    ref={videoRef}
                    onLoadedData={metadataLoad}
                    className=""
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
