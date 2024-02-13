import { ScriptTemplate } from "../types/type"

interface ScriptProps {
    props : ScriptTemplate;
    onClick : React.MouseEventHandler<HTMLDivElement>;
}


export default function ScriptTemplateCard({props, onClick} : ScriptProps) {
    return (
        <div onClick={onClick} className="border-[#e9e9e9] border-2 rounded w-full p-2 text-left cursor-pointer mb-2">
            <p className="text-lg font-bold">{props.scriptTitle}</p>
            <p className="text-base">{props.scriptContent}</p>
        </div>
    )
} 