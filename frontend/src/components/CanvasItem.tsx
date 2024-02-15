import { useEffect, useRef, useState } from 'react';
import { CanvasFont } from '../types/type';
import { hexToRgba } from '../util/get-func';
import html2canvas from 'html2canvas';

type canvasType = {
    canvasWidth: number;
    canvasHeight: number;
    sticker: string;
    stickerText: CanvasFont;
    eraser: boolean;
    stickerFlag: boolean;
    setSticker: React.Dispatch<React.SetStateAction<string>>;
    setStickerFlag: React.Dispatch<React.SetStateAction<boolean>>;
    mousePosition: mousePosition;
    scale: number;
    rotate: number;
    mode: number;
    stickerLayout: string[];
    setStickerLayout: React.Dispatch<React.SetStateAction<string[]>>;
    saveFlag: number;
    setSaveFlag: React.Dispatch<React.SetStateAction<number>>;
    setCanvasDownload: React.Dispatch<React.SetStateAction<number>>;
    setCanvasSave: React.Dispatch<React.SetStateAction<number>>;
    clearCanvas: boolean;
    customSticker: string;
    setCustomSticker: React.Dispatch<React.SetStateAction<string>>;
    setCustomStickerFlag: React.Dispatch<React.SetStateAction<boolean>>;
    customStickerFlag: boolean;
};
interface mousePosition {
    positionX: number | null;
    positionY: number | null;
}
export default function CanvasItem(props: canvasType) {
    const canvasWidth = props.canvasWidth;
    const canvasHeight = props.canvasHeight;
    const sticker = props.sticker;
    const stickerFlag = props.stickerFlag;
    const eraser = props.eraser;
    const fontContent = props.stickerText.fontContent;
    const fontColor = props.stickerText.fontColor;
    const fontSize = props.stickerText.fontSize;
    const fontFamily = props.stickerText.fontFamily;
    const fontBorder = props.stickerText.fontBorder;
    const fontBorderWidth = props.stickerText.fontBorderWidth;
    const fontShadow = props.stickerText.fontShadow;
    const fontShadowWidth = props.stickerText.fontShadowWidth;
    const fontShadowBlur = props.stickerText.fontShadowBlur;
    const mode = props.mode;
    const saveFlag = props.saveFlag;
    const setSaveFlag = props.setSaveFlag;

    const [getCtx, setGetCtx] = useState<CanvasRenderingContext2D>();
    // painting state
    const [painting, setPainting] = useState(false);
    const positionX = props.mousePosition.positionX;
    const positionY = props.mousePosition.positionY;
    const scale = props.scale;
    const rotate = props.rotate;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // canvas useRef
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            canvas.style.width = canvasWidth + 'px';
            canvas.style.height = canvasHeight + 'px';
            const devicePixelRatio = 2;
            canvas.width = canvasWidth * devicePixelRatio;
            canvas.height = canvasHeight * devicePixelRatio;
            ctx?.scale(devicePixelRatio, devicePixelRatio);
        }
    }, []);

    useEffect(() => {
        props.setStickerLayout([]);
    }, [eraser]);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, [props.clearCanvas]);

    useEffect(() => {
        if (saveFlag != 0) {
            saveCanvas();
        }
    }, [saveFlag]);

    useEffect(() => {
        if (stickerFlag) {
            imageSetting();
        }
    }, [stickerFlag]);

    /**이미지를 놔두는 곳 */
    const imageSetting = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');

            //시작 캔버스 넣기
            if (ctx && !positionX && !positionY && props.customStickerFlag) {
                const objImage = new Image();
                objImage.crossOrigin = 'anonymous';
                objImage.style.objectFit = 'contain';
                objImage.src = props.customSticker;
                props.setCustomStickerFlag(false);

                objImage.onload = () => {
                    // 이미지가 로드된 후에 실행됩니다.
                    // console.log('작동');
                    ctx.save();
                    ctx.drawImage(
                        objImage,
                        0,
                        0,
                        canvas.width / 2,
                        canvas.height / 2
                    );
                    ctx.restore();
                    saveImgUrl();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    props.setStickerFlag(false);
                    props.setSticker('');
                    props.setCustomSticker('');
                };

                // 이미지 로드 중 에러 처리
                objImage.onerror = (error) => {
                    console.error('이미지 로딩 중 에러:', error);
                };

                if (ctx === null) return;
            }
            if (ctx && positionX && positionY) {
                // mouse position
                // console.log(canvas.getBoundingClientRect().left);
                // console.log(props.mousePosition.positionX);
                // console.log(canvas.getBoundingClientRect().top);
                // console.log(props.mousePosition.positionY);

                const mouseX = positionX - canvas.getBoundingClientRect().left;
                const mouseY = positionY - canvas.getBoundingClientRect().top;
                // setting
                // 이미지 설정
                const objImage = new Image();
                // onload와 onerror 핸들러 설정 후 이미지 소스 지정

                //일반이랑 사용자랑 url이 달라서 해줘야함
                if (mode == 0 && props.customStickerFlag === true) {
                    objImage.src = props.customSticker;
                    props.setCustomStickerFlag(false);
                } else {
                    objImage.src = `/src/assets/sticker/${sticker}.png`;
                }
                // 이미지 크기 조절
                const imageSize = scale; // 이미지의 새로운 크기
                objImage.onload = () => {
                    // 이미지가 로드된 후에 실행됩니다.
                    // console.log('작동');
                    ctx.save();
                    ctx.translate(mouseX, mouseY);
                    ctx.rotate((rotate % 360) * (Math.PI / 180));

                    var aspectRatio = objImage.width / objImage.height;

                    // Canvas에 그릴 영역 계산

                    ctx.drawImage(
                        objImage,
                        -imageSize / 2,
                        -(imageSize / aspectRatio) / 2,
                        imageSize,
                        imageSize / aspectRatio
                    );
                    if (mode === 1) {
                        const font = fontSize + 'px ' + fontFamily;
                        ctx.font = font;
                        if (fontColor !== '') {
                            ctx.fillStyle = fontColor;
                        }
                        if (fontShadow !== '') {
                            const rgbaColor = hexToRgba(fontShadow, 0.5);
                            ctx.shadowColor = rgbaColor;
                            ctx.shadowOffsetX = fontShadowWidth;
                            ctx.shadowOffsetY = fontShadowWidth;
                            ctx.shadowBlur = fontShadowBlur;
                        }
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(fontContent, 0, 0);

                        if (fontBorder !== '') {
                            ctx.strokeStyle = fontBorder; // border 색상 설정
                            ctx.lineWidth = fontBorderWidth; // border 두께 설정
                            ctx.strokeText(fontContent, 0, 0);
                        }
                    }
                    ctx.restore();
                    saveImgUrl();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    props.setStickerFlag(false);
                    props.setSticker('');
                };

                // 이미지 로드 중 에러 처리
                objImage.onerror = (error) => {
                    console.error('이미지 로딩 중 에러:', error);
                };

                if (ctx === null) return;
                if (!mouseX) {
                    return;
                }
                if (!mouseY) {
                    return;
                }
            }
        }
    };

    const drawFn = (e: any) => {
        // mouse position
        const mouseX = e.nativeEvent.offsetX;
        const mouseY = e.nativeEvent.offsetY;
        // drawing
        if (!painting && getCtx) {
            getCtx.beginPath();
            getCtx.moveTo(mouseX, mouseY);
        } else {
            getCtx?.lineTo(mouseX, mouseY);
            getCtx?.stroke();
        }
    };

    const saveImgUrl = async () => {
        /* Canvas 이미지 설정 */
        const target = canvasRef.current;
        const onCapture = () => {
            // console.log('onCapture');
            if (!target) {
                return;
            }
            html2canvas(target, { scale: 1.6, backgroundColor: null }).then(
                (canvas) => {
                    const imageDataURL = canvas.toDataURL('image/png');
                    props.setStickerLayout((prev) => [...prev, imageDataURL]);
                }
            );
        };
        onCapture();
    };

    const saveCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                if (props.stickerLayout.length === 0) {
                    const objImage = new Image();
                    ctx.drawImage(
                        objImage,
                        0,
                        0,
                        canvas.width / 2,
                        canvas.height / 2
                    );
                    if (saveFlag === 1) {
                        props.setCanvasDownload(1);
                    } else if (saveFlag === 2) {
                        props.setCanvasSave(1);
                    }
                } else {
                    props.stickerLayout.map((item, index) => {
                        const objImage = new Image();
                        objImage.src = item;
                        objImage.onload = () => {
                            // 이미지가 로드된 후에 실행됩니다.
                            // console.log('작동');

                            ctx.drawImage(
                                objImage,
                                0,
                                0,
                                canvas.width / 2,
                                canvas.height / 2
                            );
                            if (
                                saveFlag === 1 &&
                                props.stickerLayout.length === index + 1
                            ) {
                                // console.log('다운로드하장');
                                props.setCanvasDownload(index + 1);
                            } else if (
                                saveFlag === 2 &&
                                props.stickerLayout.length === index + 1
                            ) {
                                // console.log('저장하장');
                                props.setCanvasSave(index + 1);
                            }
                        };
                        // 이미지 로드 중 에러 처리
                        objImage.onerror = (error) => {
                            console.error('이미지 로딩 중 에러:', error);
                        };
                    });
                }
            }
            setSaveFlag(0);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            // onMouseDown={(e) => imageSetting(e)}
        ></canvas>
    );
}
