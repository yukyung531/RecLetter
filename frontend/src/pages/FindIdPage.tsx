import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { studioNameState, studioState } from '../util/counter-slice';

export default function FindIdPage() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(studioState([]));
        dispatch(studioNameState(''));
    }, []);
    return (
        <section className="section-center">
            <p className="text-3xl font-bold mx-4 my-6">아이디 찾기</p>

            <div className="flex my-4 items-center justify-center">
                <input
                    className="input-88"
                    type="text"
                    placeholder="이메일을 입력해주세요."
                />
            </div>
            <a
                href="/findresult"
                className="w-88 py-3 px-3 my-12 rounded text-xl color-bg-yellow2 text-center"
            >
                아이디 찾기
            </a>
        </section>
    );
}
