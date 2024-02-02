import { BGMTemplate } from '../types/type';

interface Prop {
    bgm: BGMTemplate;
    selectBGM: React.MouseEventHandler<HTMLDivElement>;
}

export default function BGMCard({ bgm, selectBGM }: Prop) {
    return (
        <div
            className="relative flex w-full my-2 p-2 border-2 border-[#363636] hover:border-[#88D1F4]"
            onClick={selectBGM}
        >
            {bgm.bgmTitle}
            <audio controls crossOrigin="anonymous">
                <source src={bgm.bgmUrl} type="audio/mpeg" />
            </audio>
        </div>
    );
}
