import { StudioInfo } from "../types/type";

interface StudioCardProp {
    props: StudioInfo;
    onClick: React.MouseEventHandler<HTMLParagraphElement>;
}

export default function StudioCard({props, onClick} : StudioCardProp) {
    //참여 여부
    let isUploadUi = <p className="absolute px-3 top-4 right-4 bg-green-500 text-center text-lg border rounded-xl text-white">
                            참여 완료
                    </p>
    if(!props.isUpload){
    isUploadUi = <p className="absolute px-3 top-4 right-4 bg-red-500 text-center text-lg border rounded-xl text-white">
                                미 참여
                </p>
    }

    const studioId : string = props.studioId + "";
    
    return(
        <div className="relative flex flex-col justify-around items-center hover:bg-[#88D1F4]" id={studioId} onClick={onClick}>
            {isUploadUi}
            <img
                className="image-select-size"
                src={props.thumbnailUrl}
            />
            <div className="flex justify-around w-full px-4">
                <div className="flex items-center justify-center">
                    {props.studioTitle}
                </div>
                <p>|</p>
                <p>D-{Math.floor((props.expireDate.getTime() - Date.now()) / (1000*60*60*24))}</p>
            </div>
        </div>
    )
}