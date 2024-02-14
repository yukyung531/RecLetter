import { ScriptTemplate } from '../types/type';

interface ScriptProps {
    props: ScriptTemplate;
    onClick: React.MouseEventHandler<HTMLDivElement>;
}

export default function ScriptTemplateCard({ props, onClick }: ScriptProps) {
    return (
        <div
            onClick={onClick}
            className="border-[#F5F5F5] bg-[#F5F5F5] border-2 rounded-lg w-[90%] p-2 text-left cursor-pointer mb-2"
        >
            <p className="text-lg font-bold">{props.scriptTitle}</p>
            <p className="text-base">{props.scriptContent}</p>
        </div>
    );
}
