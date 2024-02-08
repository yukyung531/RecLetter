import { useState } from 'react';
import { StudioInfo } from '../types/type';

interface StudioCardProp {
    props: StudioInfo;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    editMode: boolean | null;
}

export default function StudioCard({
    props,
    onClick,
    editMode,
}: StudioCardProp) {
    //참여 여부
    let isUploadUi = (
        <p className="absolute px-3 top-2 right-2 border-2 color-bg-blue3 text-center text-lg rounded-xl text-white">
            참여 완료
        </p>
    );
    if (!props.hasMyClip) {
        isUploadUi = (
            <p className="absolute px-3 top-2 right-2 border-2 border-white color-bg-subbold text-center text-lg rounded-xl text-white">
                미참여
            </p>
        );
    }

    const [selected, setSelected] = useState<boolean>(false);
    const studioId: string = props.studioId + '';

    const expireDate: Date = new Date(props.expireDate);

    return (
        <div
            className="relative w-30per h-[240px] flex flex-col mx-2 my-2 justify-start items-center cursor-pointer"
            id={studioId}
            onClick={(e) => {
                onClick(e);
                setSelected(!selected);
            }}
        >
            {isUploadUi}
            <video
                className="w-full h-32 color-bg-sublight rounded-lg"
                src={props.thumbnailUrl}
                crossOrigin="anonymous"
                controlsList="nodownload"
            />{' '}
            {/*"https://d3kbsbmyfcnq5r.cloudfront.net/favicon.png" */}
            <div className="flex justify-center items-center w-full h-[112px] px-4 text-xl">
                {editMode ? (
                    <div className="relative min-w-4 w-4 h-4 -start-3 flex justify-center items-center border rounded-full border-black">
                        {selected && (
                            <div className="w-2 h-2 rounded-full color-bg-main"></div>
                        )}
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="flex items-center w-full h-full">
                    <div className="w-2/3 flex items-center justify-center">
                        {props.studioTitle}
                    </div>

                    <p className="mx-3">|</p>
                    <p className="w-[40px]">
                        D-
                        {Math.floor(
                            (expireDate.getTime() - Date.now()) /
                                (1000 * 60 * 60 * 24)
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
