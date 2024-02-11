import { useState } from 'react';
import styled from 'styled-components';

const ToggleContainer = styled.div`
    position: relative;
    cursor: pointer;

    > .toggle-container {
        width: 36px;
        height: 18px;
        border-radius: 18px;
        background-color: rgb(233, 233, 234);
    }
    > .toggle--checked {
        background-color: #ff777f;
        transition: 0.5s;
    }

    > .toggle-circle {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: rgb(255, 254, 255);
        transition: 0.5s;
    }
    > .toggle--checked {
        left: 20px;
        transition: 0.5s;
    }
`;

type ActiveType = {
    flag: boolean;
    setFlag: React.Dispatch<React.SetStateAction<boolean>>;
};
export const Toggle = (props: ActiveType) => {
    const toggleHandler = () => {
        // isOn의 상태를 변경하는 메소드를 구현
        props.setFlag(!props.flag);
    };

    return (
        <>
            <ToggleContainer
                // 클릭하면 토글이 켜진 상태(isOn)를 boolean 타입으로 변경하는 메소드가 실행
                onClick={toggleHandler}
            >
                {/* 아래에 div 엘리먼트 2개가 있다. 각각의 클래스를 'toggle-container', 'toggle-circle' 로 지정 */}
                {/* Toggle Switch가 ON인 상태일 경우에만 toggle--checked 클래스를 div 엘리먼트 2개에 모두 추가. 조건부 스타일링을 활용*/}
                <div
                    className={`toggle-container ${
                        props.flag ? 'toggle--checked' : null
                    }`}
                />
                <div
                    className={`toggle-circle ${
                        props.flag ? 'toggle--checked' : null
                    }`}
                />
            </ToggleContainer>
        </>
    );
};
