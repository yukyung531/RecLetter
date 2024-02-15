import { useState, useRef, useEffect } from 'react';

export default function LoadingModal() {
    ////////////////////////타이머 기능///////////////////////////////////////////////////////
    const timer = useRef<number | null | NodeJS.Timeout>(null);
    const [nowTime, setNowTime] = useState<number>(0);

    /**handltTimerStart()
     * 영상 촬영 시 사용하는 타이머를 시작한다.
     * 1초에 nowTime이 1씩 증가한다.
     */
    const handleTimerStart = () => {
        timer.current = setInterval(() => {
            setNowTime((prev) => prev + 1);
        }, 300);
    };

    /**handleTimerEnd()
     * 영상 촬영을 끝냈을 때 타이머를 끝낸다.
     * nowTime을 초기화하고, timer설정을 clear한다.
     */
    const handleTimerEnd = () => {
        if (timer.current) {
            setNowTime(0);
            clearInterval(timer.current);
        }
    };

    useEffect(() => {
        handleTimerStart();
        // console.log('Timer start');

        return () => {
            handleTimerEnd();
            // console.log('Timer end');
        };
    }, []);

    return (
        <>
            <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
                <p className="text-3xl text-white">
                    저장중입니다{'.'.repeat((nowTime % 3) + 1)}
                </p>
            </div>
        </>
    );
}
