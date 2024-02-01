import { OpenVidu, Session } from 'openvidu-browser';
import { useEffect, useState } from 'react';
import { getUser } from '../api/user';
import { UserInfo } from '../types/type';
import axios from 'axios';

export default function LetterViewPage() {
    //studioId 가져오기
    const splitUrl = document.location.href.split('/');
    const studioId = splitUrl[splitUrl.length - 1];

    //유저 정보
    const [userInfo, setUserInfo] = useState<UserInfo>({
        userEmail: '',
        userNickname: '',
    });

    //+유저 정보 불러오기
    const getUserInfo = async () => {
        const resuser = await getUser();
        const tempObj = { ...resuser.data };
        setUserInfo({
            userEmail: tempObj.userEmail,
            userNickname: tempObj.userNickname,
        });
    };

    ////////////////////////openvidu 정보 받아오기/////////////////

    let OV: OpenVidu;
    let session: Session;

    const APPLICATION_SERVER_URL = 'https://demos.openvidu.io/';

    const [users, setUsers] = useState<any[]>([]);
    const [newParticipant, setNewParticipant] = useState<any>();

    /**startScreenShare
     * 화면공유를 눌렀을 때 실행되는 함수다.
     */
    const startScreenShare = async () => {
        //openvidu object 가져오고 session 추가
        OV = new OpenVidu();
        session = OV.initSession();

        //session action 정의 only screen share만 존재
        session.on('streamCreated', (event) => {
            console.log('Admin -', event);
            if (event.stream.typeOfVideo == 'SCREEN') {
                const subscriber = session.subscribe(
                    event.stream,
                    'video-container'
                );

                subscriber.on('videoElementCreated', (event) => {
                    appendUserData(event.element, subscriber.stream.connection);
                });
            }
        });

        //stream파괴시
        session.on('streamDestroyed', (event) => {
            //delete html element
            removeUserData(event.stream.connection);
        });

        //오류시
        session.on('exception', (exception) => {
            console.warn(exception);
        });

        //이제 세션에 연결해 봅시다.
        getToken(studioId).then((token) => {
            session
                .connect(token, { clientData: userInfo.userEmail })
                .then(() => {
                    console.log('Session opened');
                })
                .catch((error) => {
                    console.warn(
                        'There was an error connecting to the session for screen share:',
                        error.code,
                        error.message
                    );
                });
        });
    };

    /** appendUserData
     *  userData가 추가되면 실행되는 함수입니다.
     * @param videoElement
     * @param connection
     */
    const appendUserData = (videoElement, connection) => {
        let userData;
        let nodeId;
        //유저데이터, 노드 아이디 받아오기
        if (typeof connection === 'string') {
            userData = connection;
            nodeId = connection;
        } else {
            userData = JSON.parse(connection.data).clientData;
            nodeId = connection.connectionId;
        }

        //유저 목록 추가
        setUsers((prev) => {
            const userObj = {
                nodeId,
                userData,
            };
            //새 유저 알림창 활성화
            setNewParticipant(userObj);
            //변경필요
            return [...prev, userObj];
        });
    };

    /** removeUserData
     *  유저를 지우는 함수입니다.
     * @param connection
     */
    const removeUserData = (connection) => {
        setUsers((prev) => {
            return prev.filter((user) => {
                user.nodeId !== connection.connectionId;
            });
        });
    };

    /** getToken()
     * 세션을 생성하고 접속을 위한 토큰을 가져옵니다.
     */
    const getToken = async (studioId: string) => {
        //studioId가 세션 id가 된다.
        const sessionId = await createSession(studioId);

        return await createToken(sessionId);
    };

    /**createSession(sessionId), 세션을 생성한다 */
    const createSession = async (sessionId: string) => {
        const response = await axios.post(
            APPLICATION_SERVER_URL + 'api/sessions',
            { customSessionId: sessionId },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return response.data; // The sessionId
    };

    /** createToken(sessionId)
     * 토큰을 생성한다.
     * @param sessionId
     * @returns
     */
    const createToken = async (sessionId: string) => {
        const response = await axios.post(
            APPLICATION_SERVER_URL +
                'api/sessions/' +
                sessionId +
                '/connections',
            {},
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return response.data; // The token
    };

    /**세션을 종료합니다. */
    const endScreenShare = async () => {
        //세션 종료
        // endSession(studioId);

        //세션 연결 종료, 유저 정보 초기화
        session.disconnect();
        setUsers([]);
    };

    /**윈도우 창을 닫으면 자동 종료 */
    window.onbeforeunload = () => {
        if (session) endScreenShare();
    };

    //초기세팅
    useEffect(() => {
        const initSetting = async () => {
            await getUserInfo();
            await startScreenShare();
        };
        initSetting();
    }, []);

    return (
        <section className="relative section-top pt-16">
            <h1>Welcome to Letter View Page</h1>
            <p>지금 다른 사람이 수정하고 있으니 쉬고 계세요.</p>
        </section>
    );
}
