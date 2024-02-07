import { BaseSyntheticEvent, useState } from 'react';
import { ClipInfo } from '../types/type';

interface PropClip {
    props: ClipInfo;
    onClick: React.MouseEventHandler<HTMLSpanElement>;
    onLinkClick: React.MouseEventHandler<HTMLDivElement>;
    onNameChange: React.MouseEventHandler<HTMLSpanElement>;
    setChangingName: React.Dispatch<React.SetStateAction<string>>;
    selectedClip: ClipInfo;
}

export default function MyClipCard({
    props,
    onClick,
    onLinkClick,
    onNameChange,
    setChangingName,
    selectedClip,
}: PropClip) {
    const [isEditingName, setIsEditingName] = useState<boolean>(false);

    const [name, setName] = useState<string>(props.clipTitle);
    const changeName = (event: BaseSyntheticEvent) => {
        setName(event.target.value);
        setChangingName(event.target.value);
    };

    return (
        <div
            className={`relative flex w-full my-2 p-2 border-2 hover:color-border-main cursor-pointer rounded-m ${
                selectedClip.clipId === props.clipId ? 'border-red-500' : ''
            }`}
            onClick={onLinkClick}
        >
            <video
                className="w-16 h-12 bg-gray-200"
                src={props.clipUrl}
                preload="metadata"
                style={{ transform: `rotateY(180deg)` }}
            />
            <div className="ms-2">
                {!isEditingName ? (
                    <p className="font-bold">{props.clipTitle}</p>
                ) : (
                    <input
                        type="text"
                        className="text-base w-[80px]"
                        value={name}
                        onChange={(event) => changeName(event)}
                    />
                )}
                <p>
                    {props.clipLength >= 60 ? 1 : 0} :{' '}
                    {Math.round(props.clipLength % 60) < 10
                        ? '0' + Math.round(props.clipLength % 60)
                        : Math.round(props.clipLength % 60)}
                </p>
            </div>
            {!isEditingName ? (
                <span
                    className="material-symbols-outlined text-xl bottom-0 right-0 color-text-black"
                    onClick={() => {
                        setIsEditingName(true);
                        setChangingName(props.clipTitle);
                    }}
                >
                    edit
                </span>
            ) : (
                <span
                    className="material-symbols-outlined text-xl bottom-0 right-0 color-text-black"
                    onClick={(event) => {
                        setIsEditingName(false);
                        onNameChange(event);
                    }}
                >
                    check_box
                </span>
            )}
            <span
                className="material-symbols-outlined text-xl absolute top-0 right-0 color-text-main"
                onClick={onClick}
            >
                delete
            </span>
        </div>
    );
}
