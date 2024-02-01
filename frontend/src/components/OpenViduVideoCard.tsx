import { useEffect, useRef } from 'react';

export default function OpenViduVideoCard({ streamManager }) {
    const userNickname = JSON.parse(
        streamManager.stream.connection.data
    ).clientData;

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        console.log('Now videoRef - ', videoRef.current);
        streamManager.addVideoElement(videoRef.current);
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
