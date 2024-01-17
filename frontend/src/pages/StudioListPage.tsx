import { studioList } from "../dummy-datas/studioList";
import StudioCard from "../components/StudioCard";

export default function StudioListPage() {
    return (
        <section className="relative section-top pt-20 mt-16 ml-8">
            <ul className="w-full flex flex-col">
                <li className="text-2xl">
                    <p className="font-bold">내가 생성한 스튜디오</p>
                    <div className="flex my-4">
                        <a
                            href="/create"
                            className="border border-dotted border-4 border-gray-600 image-select-size flex items-center justify-center"
                        >
                            + 방 생성
                        </a>
                        {
                            studioList.map((studio) => {
                                if(studio.isStudioOwner && !studio.studioStatus){
                                    return <StudioCard key={studio.studioId} {...studio} />
                                }
                            })
                        }
                    </div>
                </li>
                <li className="text-2xl">
                    <p className="font-bold">참여중인 스튜디오</p>
                    <div className="flex my-4">
                        {
                            studioList.map((studio) => {
                                if(studio.isUpload && !studio.studioStatus){
                                    return <StudioCard key={studio.studioId} {...studio} />
                                }
                            })
                        }
                    </div>
                </li>
                <li className="text-2xl">
                    <p className="font-bold">완성된 비디오</p>
                    <div className="flex my-4">
                        {
                            studioList.map((studio) => {
                                if(studio.studioStatus){
                                    return <StudioCard key={studio.studioId} {...studio} />
                                }
                            })
                        }
                    </div>
                </li>
            </ul>
        </section>
    );
}
