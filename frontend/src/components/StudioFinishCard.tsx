import { StudioInfo } from '../types/type';

interface StudioCardProp {
    props: StudioInfo;
    onClick: React.MouseEventHandler<HTMLParagraphElement>;
}

export default function StudioFinishCard({ props, onClick }: StudioCardProp) {
    //참여 여부
    let isUploadUi = (
        <p className="absolute px-3 top-2 right-2 border-2 color-bg-blue3 text-center text-lg rounded-xl text-white">
            참여 완료
        </p>
    );
    if (!props.hasMyClip) {
        isUploadUi = (
            <p className="absolute px-3 top-2 right-2 border-2 border-white color-bg-subbold text-center text-lg rounded-xl text-white">
                미 참여
            </p>
        );
    }

    const studioId: string = props.studioId + '';

    const expireDate: Date = new Date(props.expireDate);

    return (
        <div
            className="relative w-5/6 flex mx-2 my-2 items-center hover:bg-[#88D1F4] bg-white rounded-lg shadow-lg"
            id={studioId}
            onClick={onClick}
        >
            <img
                className="w-full h-32 mx-2 my-2 color-bg-sublight rounded-lg"
                src={props.thumbnailUrl}
            />
            <div className="flex w-full h-full flex-col justify-between px-4 py-3">
                <div className="text-xl">{props.studioTitle}</div>
                <div className="flex justify-between items-center">
                    <p className="color-text-darkgray">
                        D-
                        {Math.floor(
                            (expireDate.getTime() - Date.now()) /
                                (1000 * 60 * 60 * 24)
                        )}
                    </p>
                    <span className="relative material-symbols-outlined top-1">
                        attach_email
                    </span>
                </div>
            </div>
        </div>
    );
}
