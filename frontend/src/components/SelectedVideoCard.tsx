import { ClipInfo } from '../types/type';

interface Prop {
    clip: ClipInfo;
    unselectClip: React.MouseEventHandler<HTMLButtonElement>;
    changeVolume: React.ChangeEventHandler<HTMLInputElement>;
}

export default function SelectedVideoCard({
    clip,
    unselectClip,
    changeVolume,
}: Prop) {
    return (
        <>
            <div className="w-28 flex flex-col justify-center mx-2">
                <button onClick={unselectClip}>선택 취소</button>
                <video
                    src={clip.clipUrl}
                    // style={{ display: 'none' }}
                    crossOrigin="anonymous"
                    preload="metadata"
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
