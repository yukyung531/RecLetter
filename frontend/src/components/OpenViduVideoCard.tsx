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
        <div id={userNickname}>
            <video
                ref={videoRef}
                autoPlay={true}
                style={{ width: '640px', height: '480px' }}
            ></video>
            <p>{userNickname}</p>
        </div>
    );
}
