import { BaseSyntheticEvent, useState } from "react";
import { ClipInfo } from "../types/type"

interface PropClip {
    props: ClipInfo;
    onClick: React.MouseEventHandler<HTMLSpanElement>;
    onLinkClick: React.MouseEventHandler<HTMLDivElement>;
    onNameChange: React.MouseEventHandler<HTMLSpanElement>;
    setChangingName: React.Dispatch<React.SetStateAction<string>>;
}


export default function MyClipCard({props, onClick, onLinkClick, onNameChange, setChangingName} : PropClip){
    const [isEditingName, setIsEditingName] = useState<boolean>(false);

    const [name, setName] = useState<string>(props.clipTitle);
    const changeName = (event: BaseSyntheticEvent) => {
        setName(event.target.value);
        setChangingName(event.target.value);
    }



    return(
        <div className="relative flex w-full my-2 p-2 border-2 border-[#363636] hover:border-[#88D1F4]" onClick={onLinkClick}>
            <img
                className="w-16 h-12"
                src={props.clipThumbnail}
                alt={props.clipTitle}
            />
            <div className="ms-2">
                {!isEditingName?
                <p className="font-bold">{props.clipTitle}</p> :
                <input type="text" className="text-base w-9" value={name} onChange={(event) => changeName(event)}/>
                }
                <p>{props.clipLength>=60 ? 1 : 0} : {(props.clipLength % 60) < 10 ? '0'+(props.clipLength % 60) : (props.clipLength % 60)}</p>
            </div>
            {!isEditingName?
                <span className="material-symbols-outlined text-xl bottom-0 right-0 color-text-black" onClick={() => {
                    setIsEditingName(true)
                    setChangingName(props.clipTitle)
                    }}>
                    edit
                </span>
                :
                <span className="material-symbols-outlined text-xl bottom-0 right-0 color-text-black" onClick={(event) => {
                    setIsEditingName(false);
                    onNameChange(event);
                }}>
                    check_box
                </span>
            }
            <span className="material-symbols-outlined text-xl absolute bottom-0 right-0 color-text-red3" onClick={onClick}>
                delete
            </span>
        </div>
    )
}