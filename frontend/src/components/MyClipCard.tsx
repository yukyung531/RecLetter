import { ClipInfo } from "../types/type"

interface PropClip {
    props: ClipInfo;
    onClick: React.MouseEventHandler<HTMLParagraphElement>;
}


export default function MyClipCard({props, onClick} : PropClip){
    return(
        <div className="relative flex w-full my-2 p-2 border-2 border-[#363636] hover:border-[#88D1F4]">
            <img
                className="w-16 h-12"
                src={props.clipThumbnail}
                alt={props.clipTitle}
            />
            <div className="ms-2">
                <p className="font-bold">{props.clipTitle}</p>
                <p>{props.clipLength>=60 ? 1 : 0} : {(props.clipLength % 60) < 10 ? '0'+(props.clipLength % 60) : (props.clipLength % 60)}</p>
            </div>
            <span className="material-symbols-outlined text-xl absolute bottom-0 right-0 color-text-red3" onClick={onClick}>
                delete
            </span>
        </div>
    )
}