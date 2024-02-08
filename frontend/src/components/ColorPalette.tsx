import { CanvasFont } from '../types/type';

type PaletteType = {
    setColor: React.Dispatch<React.SetStateAction<CanvasFont>>;
    target: string;
    flag: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ColorPalette(props: PaletteType) {
    const SetStateAction = props.setColor;
    const target = props.target;
    const flag = props.flag;
    return (
        <div className="w-80 bg-white border rounded-lg">
            <div className="p-2 flex justify-between">
                <p>색상</p>
                <p
                    className=" cursor-pointer"
                    onClick={() => {
                        flag(false);
                    }}
                >
                    X
                </p>
            </div>
            <div>
                <p>기본 팔레트</p>
                <ul>
                    <li className="flex m-2">
                        <p
                            className="w-6 h-6 m-2 rounded-md hover:color-border-main"
                            style={{ backgroundColor: '#000000' }}
                            onClick={() => {
                                if (target === 'fontColor') {
                                    SetStateAction((prev) => ({
                                        ...prev, // 이전 상태를 복사합니다.
                                        fontColor: '#000000', // 특정 값을 수정합니다.
                                    }));
                                } else if (target === 'fontBorder') {
                                    SetStateAction((prev) => ({
                                        ...prev, // 이전 상태를 복사합니다.
                                        fontBorder: '#000000', // 특정 값을 수정합니다.
                                    }));
                                } else if (target === 'fontShadow') {
                                    SetStateAction((prev) => ({
                                        ...prev, // 이전 상태를 복사합니다.
                                        fontShadow: '#000000', // 특정 값을 수정합니다.
                                    }));
                                }
                            }}
                        ></p>
                        <p
                            className="w-6 h-6 m-2 rounded-md hover:color-border-main"
                            style={{ backgroundColor: '#ff4954' }}
                            onClick={() => {
                                if (target === 'fontColor') {
                                    SetStateAction((prev) => ({
                                        ...prev, // 이전 상태를 복사합니다.
                                        fontColor: '#ff4954', // 특정 값을 수정합니다.
                                    }));
                                } else if (target === 'fontBorder') {
                                    SetStateAction((prev) => ({
                                        ...prev, // 이전 상태를 복사합니다.
                                        fontBorder: '#ff4954', // 특정 값을 수정합니다.
                                    }));
                                } else if (target === 'fontShadow') {
                                    SetStateAction((prev) => ({
                                        ...prev, // 이전 상태를 복사합니다.
                                        fontShadow: '#ff4954', // 특정 값을 수정합니다.
                                    }));
                                }
                            }}
                        ></p>
                        <p
                            className="w-6 h-6 m-2 rounded-md hover:color-border-main"
                            style={{ backgroundColor: '#18A8F1' }}
                            onClick={() => {
                                if (target === 'fontColor') {
                                    SetStateAction((prev) => ({
                                        ...prev, // 이전 상태를 복사합니다.
                                        fontColor: '#18A8F1', // 특정 값을 수정합니다.
                                    }));
                                } else if (target === 'fontBorder') {
                                    SetStateAction((prev) => ({
                                        ...prev, // 이전 상태를 복사합니다.
                                        fontBorder: '#18A8F1', // 특정 값을 수정합니다.
                                    }));
                                } else if (target === 'fontShadow') {
                                    SetStateAction((prev) => ({
                                        ...prev, // 이전 상태를 복사합니다.
                                        fontShadow: '#18A8F1', // 특정 값을 수정합니다.
                                    }));
                                }
                            }}
                        ></p>
                    </li>
                </ul>
            </div>
        </div>
    );
}
