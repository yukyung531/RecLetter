////주의! 이 페이지는 alert창 디자인 요소를 보기 위해 존재하는 창입니다.
//프로젝트 완성 후 꼭! 삭제해주시기 바랍니다.

import LoginErrorModal from '../components/LoginErrorModal';

export default function DesignTest() {
    const hello = () => {
        console.log('hello');
    };

    return (
        <>
            <LoginErrorModal onClick={hello} />
        </>
    );
}
