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
                className={`relative w-28 h-[94%] flex flex-col justify-center mx-2`}
            >
                <button
                    className="absolute w-6 h-6 -right-2 top-2 color-bg-main rounded-full z-10 flex justify-center items-center text-white"
                    onClick={unselectClip}
                >
                    -
                </button>
                <div onClick={selectCard}>
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

                    <video
                        src={clip.clipUrl}
                        style={{ transform: `rotateY(180deg)` }}
                        crossOrigin="anonymous"
                        preload="metadata"
                        ref={videoRef}
                        onLoadedData={metadataLoad}
                        className="mt-2 h-20"
                    />
                    <p className="mt-1 overflow-ellipsis overflow-hidden whitespace-nowrap">
                        {clip.clipTitle}
                    </p>

                    <input
                        className="w-28"
                        type="range"
                        min={0}
                        max={200}
                        defaultValue={clip.clipVolume}
                        value={clip.clipVolume}
                        onChange={changeVolume}
                        style={{
                            background: clip.clipVolume
                                ? `linear-gradient(to right,#ff4954 ${
                                      clip.clipVolume / 2
                                  }%, rgba(229,231,235,0.8) ${
                                      clip.clipVolume / 2
                                  }% 100%)`
                                : '#E5E7EB',
                        }}
                    />
                </div>
            </div>
        </>
    );
}
