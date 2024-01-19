import {useState, useRef, BaseSyntheticEvent} from 'react';

type WindowProps = {
    onClose: () => void
}

export default function AddMemberWindow({onClose} : WindowProps) {
    const inputListRef = useRef<HTMLInputElement>(null);
    const [userList, setUserList] = useState<string[]>([]);
    
    //리스트 추가
    const listUpdate = () => {
        if(inputListRef.current !== null){

            const inputData: string[] = inputListRef.current.value.split(" ");
            const newData: string[] = [];
            //이름만 입력되게 설정
            inputData.map((value) => {
                if(value !== '' && value[0] !== '@'){
                    newData.push(value);
                }
            })
            //중복제거 도입
            setUserList((prevData) => {
                const updateSet : Set<string> = new Set<string>([...prevData, ...newData]);
                const updateData : string[] = [...updateSet]
                return updateData
            })
            inputListRef.current.value = "";
        }
    }

    //멤버 삭제
    //요소 누르면 자동 삭제
    const deleteMember = (event : BaseSyntheticEvent) => {
        setUserList((prevList) => {
            for(let i = 0; i < prevList.length; i++){
                console.log(prevList[i], event.target.innerText);
                if(prevList[i] === event.target.innerText){
                    prevList.splice(i, 1);
                    break;
                }
            }
            const updateList: string[] = [...prevList];
            return updateList;
        })
    }
    
    
    return(
        <>
            <div className="w-[572px] h-[476px] p-2 border-solid border-2 border-[#363636] fixed bg-white flex flex-col">
                <div className="flex justify-between">
                    <h5 className="text-2xl">멤버 초대</h5>
                    <div onClick={onClose} className="text-2xl">X</div>
                </div>
                <div className='flex justify-between'>
                    <input type='text' className='w-4/5 border-solid border-2 border-[#363636] rounded m-1' ref={inputListRef}/>
                    <button onClick={listUpdate} className='w-1/5 rounded bg-[#363636] text-white m-1'>등록</button>
                </div>
                <div className='border-solid border-2 border-[#363636] overflow-auto'>
                    <ul>
                        {userList.map((user) => {
                            return (<li key={user} onClick={(event) => {deleteMember(event)}} className='hover:line-through'>{user}</li>)
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}