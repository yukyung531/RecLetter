import studio from "../dummy-datas/studioList.json";
import StudioCard from "../components/StudioCard";
import {useState, useEffect} from 'react';
import { StudioInfo } from "../types/type";
import { useNavigate } from "react-router-dom";


export default function StudioListPage() {
    const [studioList, setStudioList] = useState<StudioInfo[]>([]);

    const navigator = useNavigate();

    const onClickSCard = (studioId : number) => {
        navigator(`/studiomain?id=${studioId}`);
    }

    //스튜디오 정보 불러오기
    useEffect(() => {

        const newStudioList : StudioInfo[] = [];

        studio.map((value)=> {
            const newValue : StudioInfo = {
                studioId: value.studioId,
                studioTitle: value.studioTitle,
                isStudioOwner: value.isStudioOwner,
                studioStatus: value.studioStatus,
                thumbnailUrl: value.thumbnailUrl,
                expireDate: new Date(value.expireDate),
                isUpload: value.isUpload
            }
            newStudioList.push(newValue);
        })
        setStudioList(newStudioList);
    },[])

    return (
        <section className="relative section-top pt-20 mt-16 ml-8">
            <ul className="w-full flex flex-col">
                <li className="text-2xl">
                    <p className="font-bold">내가 생성한 스튜디오</p>
                    <div className="flex my-4">
                        <a
                            href="/create"
                            className="border-dotted border-4 border-gray-600 image-select-size flex items-center justify-center"
                        >
                            + 방 생성
                        </a>
                        {
                            studioList.map((studio) => {
                                if(studio.isStudioOwner && !studio.studioStatus){
                                    return <StudioCard key={studio.studioId} props={studio} onClick={() => onClickSCard(studio.studioId)} />
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
                                    return <StudioCard key={studio.studioId} props={studio} onClick={() => onClickSCard(studio.studioId)} />
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
                                    return <StudioCard key={studio.studioId} props={studio} onClick={() => onClickSCard(studio.studioId)} />
                                }
                            })
                        }
                    </div>
                </li>
            </ul>
        </section>
    );
}
