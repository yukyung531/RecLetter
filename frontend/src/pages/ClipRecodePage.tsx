import {useState, useEffect} from 'react';
import clipList from '../dummy-datas/clipList.json';
import { ClipInfo } from '../types/type';
import MyClipCard from '../components/MyClipCard';

export default function ClipRecodePage() {


    const [myClipList, setMyClipList] = useState<ClipInfo[]>([]);
    //정보 불러오기
    useEffect(() => {
        const userId : string | null = localStorage.getItem("userId");
        const newList : ClipInfo[] = [];
        clipList.map((clip) => {
            if(clip.clipOwner === userId){
                newList.push(clip);
            }
        })
        setMyClipList(newList);
    }, [])

    //동영상 삭제
    const onPressDelete = (clipId: number) => {
        setMyClipList((prevList) => {
            for(let i = 0; i < prevList.length; i++){
                if(prevList[i].clipId === clipId){
                    prevList.splice(i, 1);
                    break;
                }
            }
            const newList: ClipInfo[] = [...prevList];
            return newList;
        })
    }


    return (
        <section className="relative section-top">
            <div className="h-20 w-full px-12 color-text-black flex justify-between items-center">
                <div className="flex items-center">
                    <span className="material-symbols-outlined">
                        arrow_back_ios
                    </span>
                    <p className="text-3xl">studio1</p>
                    <div className="ml-20" />
                    <p>2024-01-14-02:12AM</p>
                </div>
                <a
                    href="/clipedit"
                    className="btn-cover color-bg-blue3 text-white"
                >
                    편집하기
                </a>
            </div>

            {/* 중앙 섹션 */}
            <div className="flex w-full editor-height">
                {/* 좌측부분 */}
                <div className="w-1/4 editor-height flex">
                    {/* 카테고리 */}
                    <div className="w-1/5 ">
                        <div className="h-28 bg-orange-100 flex flex-col justify-center items-center categori-selected">
                            <span className="material-symbols-outlined text-3xl">
                                movie_edit
                            </span>
                            <p className="font-bold">영상</p>
                        </div>
                        <div className="h-28 bg-orange-100 flex flex-col justify-center items-center">
                            <span className="material-symbols-outlined text-3xl">
                                kid_star
                            </span>
                            <p className="font-bold">스크립트</p>
                        </div>
                        <div className="h-28 bg-orange-100 flex flex-col justify-center items-center">
                            <span className="material-symbols-outlined text-3xl">
                                <span className="material-symbols-outlined">
                                    settings
                                </span>
                            </span>
                            <p className="font-bold">설정</p>
                        </div>
                    </div>
                    {/* 카테고리 선택에 따라 */}
                    <div className="w-4/5 flex flex-col items-center p-6 overflow-y-scroll">
                        <div className="w-full flex justify-start text-xl ">
                            <p>선택하지 않은 영상</p>
                        </div>
                        {
                            myClipList.map((clip) => {
                                if(clip.clipOrder === -1){
                                    return <MyClipCard props={clip} onClick={() => {onPressDelete(clip.clipId)}}/>
                                }
                            })
                        }
                        <p>-------------------------------------</p>
                        <div className="w-full flex justify-start text-xl ">
                            <p>선택한 영상</p>
                        </div>
                        {
                            myClipList.map((clip) => {
                                if(clip.clipOrder !== -1){
                                    return <MyClipCard props={clip} onClick={() => {onPressDelete(clip.clipId)}}/>
                                }
                            })
                        }
                    </div>
                </div>
                {/* 우측부분 */}
                <div className="w-3/4 editor-height bg-gray-50 flex justify-between">
                    <div className="w-full px-4 py-4 flex flex-col justify-center items-center">
                        <div className="movie-width flex justify-start items-center mt-0">
                            <p className="text-2xl">은쮸</p>
                        </div>
                        <input
                            className="my-3 py-3 rounded-full border-2 border-black movie-width text-center text-xl"
                            type="text"
                            value="스크립트 입니다. 하바바바바바"
                        />
                        <img
                            className="bg-white border my-2"
                            style={{ width: '560px', height: '350px' }}
                            src="/src/assets/images/nothumb.png"
                        />
                        <div className="w-full flex flex-col justify-center items-center my-4">
                            <div>
                                <span className="material-symbols-outlined me-1 text-4xl">
                                    play_circle
                                </span>
                                <span className="material-symbols-outlined me-1 text-4xl color-text-red3">
                                    radio_button_checked
                                </span>
                                <span className="material-symbols-outlined me-1 text-4xl">
                                    stop_circle
                                </span>
                            </div>
                            <div className="w-3/4 h-2 bg-black"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
