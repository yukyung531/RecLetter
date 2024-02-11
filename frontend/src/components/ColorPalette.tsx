import styled from 'styled-components';
import { CanvasFont } from '../types/type';
import { BaseSyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { colorAddState, colorDeleteState } from '../util/counter-slice';

type PaletteType = {
    setColor: React.Dispatch<React.SetStateAction<CanvasFont>>;
    target: string;
};

export default function ColorPalette(props: PaletteType) {
    const [customFlag, setCustomFlag] = useState<boolean>(false);
    const [customColor, setCustomColor] = useState<string>('');
    const SetStateAction = props.setColor;
    const target = props.target;

    /** 리덕스 설정 */
    const customState: string[] = useSelector(
        (state: any) => state.loginFlag.customColorSet
    );
    const dispatch = useDispatch();
    // dispatch(colorAddState("aaaaaa"));
    // dispatch(colorDeleteState("aaaaaa"));

    const colorArray: string[] = [
        'ffa9a9',
        'ff777f',
        'ff4954',
        'fffacf',
        'fff593',
        'ffc165',
        '9ccaff',
        '65a6f2',
        '2c75e2',
    ];

    const colorEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            dispatch(colorAddState(customColor));
            setCustomColor('');
        }
    };

    const onChangeColorCode = (code: string) => {
        const colorCode = '#' + code;
        if (target === 'fontColor') {
            SetStateAction((prev) => ({
                ...prev, // 이전 상태를 복사합니다.
                fontColor: colorCode, // 특정 값을 수정합니다.
            }));
        } else if (target === 'fontBorder') {
            SetStateAction((prev) => ({
                ...prev, // 이전 상태를 복사합니다.
                fontBorder: colorCode, // 특정 값을 수정합니다.
            }));
        } else if (target === 'fontShadow') {
            SetStateAction((prev) => ({
                ...prev, // 이전 상태를 복사합니다.
                fontShadow: colorCode, // 특정 값을 수정합니다.
            }));
        }
    };
    const onChangeCustomCode = (e: BaseSyntheticEvent) => {
        setCustomColor(e.target.value);
    };
    const onClickCustomColor = (code: string) => {
        const colorCode = '#' + code;
        if (target === 'fontColor') {
            SetStateAction((prev) => ({
                ...prev, // 이전 상태를 복사합니다.
                fontColor: colorCode, // 특정 값을 수정합니다.
            }));
        } else if (target === 'fontBorder') {
            SetStateAction((prev) => ({
                ...prev, // 이전 상태를 복사합니다.
                fontBorder: colorCode, // 특정 값을 수정합니다.
            }));
        } else if (target === 'fontShadow') {
            SetStateAction((prev) => ({
                ...prev, // 이전 상태를 복사합니다.
                fontShadow: colorCode, // 특정 값을 수정합니다.
            }));
        }
        setCustomColor(code);
    };
    return (
        <div>
            <div className="flex items-center mt-4 mb-2">
                <p>색상</p>
                {colorArray.map((item, key) => {
                    return (
                        <div
                            key={'paletteColor : ' + key}
                            className="w-4 h-4 border rounded-sm p-0.5 mx-0.5 cursor-pointer hover:color-border-main"
                            onClick={() => {
                                onChangeColorCode(`${item}`);
                            }}
                        >
                            <div
                                className="w-full h-full rounded-sm"
                                style={{ backgroundColor: `#${item}` }}
                            ></div>
                        </div>
                    );
                })}
                <div
                    className="relative w-4 h-4 flex justify-center items-center border rounded-sm p-0.5 mx-0.5 cursor-pointer hover:color-border-main"
                    onClick={() => {
                        setCustomFlag(!customFlag);
                    }}
                >
                    <img
                        className="w-full h-full rounded-sm"
                        src="/src/assets/images/rainbow-gradient.png"
                    />
                    <img
                        className="absolute w-3.5 h-3.5"
                        src="/src/assets/icons/plus-button.png"
                        alt=""
                    />
                </div>
            </div>
            {customFlag ? (
                <div className="my-2 px-1 py-1 border color-border-darkgray rounded-md">
                    <div className="flex justify-around items-center">
                        <p className="text-lg">나만의 색상</p>
                        <div className="py-0.5 flex justify-between items-center border color-border-darkgray rounded-md">
                            <div className="flex px-1">
                                <p>#</p>
                                <input
                                    className="w-20 outline-none"
                                    type="text"
                                    value={customColor}
                                    onChange={onChangeCustomCode}
                                    onKeyDown={colorEnter}
                                />
                            </div>

                            <div className="flex">
                                <div className="w-4 h-4 border rounded-sm p-0.5 cursor-pointer hover:color-border-main">
                                    <div
                                        className="w-full h-full rounded-sm"
                                        style={{
                                            backgroundColor: `#${customColor}`,
                                        }}
                                    ></div>
                                </div>
                                <img
                                    className="w-4 h-4 p-0.5 ms-0.5 cursor-pointer "
                                    src="/src/assets/icons/plus-button.png"
                                    alt=""
                                    onClick={() => {
                                        dispatch(colorAddState(customColor));
                                    }}
                                />
                                <img
                                    className="w-4 h-4 p-0.5 cursor-pointer "
                                    src="/src/assets/icons/minus-button.png"
                                    alt=""
                                    onClick={() => {
                                        dispatch(colorDeleteState(customColor));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        {customState.map((item, index) => {
                            return (
                                <div
                                    key={'customPalette : ' + index}
                                    className="w-4 h-4 border rounded-sm p-0.5 mx-0.5 cursor-pointer hover:color-border-main"
                                    onClick={() => {
                                        onClickCustomColor(`${item}`);
                                    }}
                                >
                                    <div
                                        className="w-full h-full rounded-sm"
                                        style={{ backgroundColor: `#${item}` }}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
