import { ScriptTemplate } from "../types/type"

interface ScriptProps {
    props : ScriptTemplate;
    onClick : React.MouseEventHandler<HTMLDivElement>;
}


export default function ScriptTemplateCard({props, onClick} : ScriptProps) {
    return (
        <div onClick={onClick} className="border-[#363636] border-2 rounded w-full p-2 text-center cursor-pointer">
            <p className="text-lg font-bold">{props.scriptTitle}</p>
            <p className="text-base">{props.scriptContent}</p>
        </div>
    )
} 