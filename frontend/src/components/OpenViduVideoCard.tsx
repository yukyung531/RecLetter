import { Subscriber, Publisher } from 'openvidu-browser';
import { useEffect, useRef } from 'react';

interface props {
    streamManager: Publisher | Subscriber;
}

export default function OpenViduVideoCard({ streamManager }: props) {
    const userNickname = JSON.parse(
        streamManager.stream.connection.data
    ).clientData;

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return (
        <div id={userNickname} className="m-2 max-h-full">
            <p className="text-2xl text-center text-white">
                {userNickname}님의 편집화면을 보는 중입니다.
            </p>
            <video
                ref={videoRef}
                autoPlay={true}
                style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: '#FFF593 5px solid',
                }}
            ></video>
        </div>
    );
}
