import { useEffect, useRef, useState } from 'react';

type canvasType = {
    canvasWidth: number;
    canvasHeight: number;
    sticker: string;
    eraser: boolean;
    stickerFlag: boolean;
    setSticker: React.Dispatch<React.SetStateAction<string>>;
    setStickerFlag: React.Dispatch<React.SetStateAction<boolean>>;
    mousePosition: mousePosition;
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
    const [getCtx, setGetCtx] = useState<CanvasRenderingContext2D>();
    // painting state
    const [painting, setPainting] = useState(false);
    const positionX = props.mousePosition.positionX;
    const positionY = props.mousePosition.positionY;

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
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, [eraser]);

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
            if (ctx && positionX && positionY) {
                // mouse position
                console.log(canvas.getBoundingClientRect().left);
                console.log(props.mousePosition.positionX);
                console.log(canvas.getBoundingClientRect().top);
                console.log(props.mousePosition.positionY);

                const mouseX =
                    positionX - canvas.getBoundingClientRect().left - 80;
                const mouseY =
                    positionY - canvas.getBoundingClientRect().top - 80;
                // setting
                // 이미지 설정
                const objImage = new Image();
                // onload와 onerror 핸들러 설정 후 이미지 소스 지정
                objImage.src = `/src/assets/sticker/${sticker}.png`;
                // 이미지 크기 조절
                const imageSize = 160; // 이미지의 새로운 크기
                objImage.onload = () => {
                    // 이미지가 로드된 후에 실행됩니다.
                    console.log('작동');
                    ctx.drawImage(
                        objImage,
                        mouseX,
                        mouseY,
                        imageSize,
                        imageSize
                    );
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

    return (
        <canvas
            ref={canvasRef}
            // onMouseDown={(e) => imageSetting(e)}
        ></canvas>
    );
}
