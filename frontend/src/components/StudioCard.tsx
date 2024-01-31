import { StudioInfo } from '../types/type';

interface StudioCardProp {
    props: StudioInfo;
    onClick: React.MouseEventHandler<HTMLParagraphElement>;
}

export default function StudioCard({ props, onClick }: StudioCardProp) {
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
            className="relative w-30per flex flex-col mx-2 my-2 justify-around items-center hover:bg-[#88D1F4]"
            id={studioId}
            onClick={onClick}
        >
            {isUploadUi}
            <video
                className="w-full h-32 color-bg-sublight rounded-lg"
                src={props.thumbnailUrl}
                crossOrigin="anonymous"
                controlsList="nodownload"
            />{' '}
            {/*"https://d3kbsbmyfcnq5r.cloudfront.net/favicon.png" */}
            <div className="flex justify-center w-full px-4 text-xl">
                <div className="flex items-center justify-center">
                    {props.studioTitle}
                </div>
                <p className="mx-5">|</p>
                <p>
                    D-
                    {Math.floor(
                        (expireDate.getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24)
                    )}
                </p>
            </div>
        </div>
    );
}
