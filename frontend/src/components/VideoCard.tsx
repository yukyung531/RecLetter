import { ClipInfo } from "../types/type";


interface VideoCardProp {
    onClick?: React.MouseEventHandler<HTMLParagraphElement>;
    onDelete?: React.MouseEventHandler<HTMLParagraphElement>;
    props: ClipInfo;
}

export default function VideoCard({onClick, onDelete, props} : VideoCardProp) {
    //userId에 따라 편집, 삭제 기능 활성화
    const userId = localStorage.getItem("userId"); //로컬스토리지에서 불러오기

    //clipId 문자열 변형
    const clipId : string = props.clipId+"";

    //hover시 class에 color-border-blue2 추가
    return(
        <div className="flex w-full my-2 p-2 border-2 hover:border-[#65a6f2]" id={clipId}>
            <img
                className="w-16 h-12"
                src={props.clipThumbnail}
                alt={props.clipTitle}
            />
            <div className="ms-2">
                <p className="font-bold w-9">{props.clipTitle}</p>
                <p>{props.clipLength>=60 ? 1 : 0} : {(props.clipLength % 60) < 10 ? '0'+(props.clipLength % 60) : (props.clipLength % 60)}</p>
            </div>
            {userId === props.clipOwner ? <div className="w-full flex flex-col items-end me-2">
                                                <p className="w-14 my-0.5 px-3 text-center color-bg-red2 text-white" onClick={onClick}>
                                                    편집
                                                </p>
                                                <p className="w-14 my-0.5 px-3 text-center color-bg-black text-white" onClick={onDelete}>
                                                    삭제
                                                </p>
                                            </div> : <></>} 
        </div>
    )
}