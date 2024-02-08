export const getlastPath = () => {
    const splitUrl = document.location.href.split('/');
    const lastPath = splitUrl.length > 4 ? splitUrl[splitUrl.length - 1] : '';
    return lastPath;
};
/** hex값을 rgb로 바꿔주는 함수 */
export const hexToRgba = (hex: string, alpha: number) => {
    // hex 코드에서 빨강, 초록, 파랑 성분 추출
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // alpha (투명도) 값 설정
    const parsedAlpha = alpha !== undefined ? alpha : 1;

    // RGBA 형식으로 반환
    return `rgba(${r}, ${g}, ${b}, ${parsedAlpha})`;
};
