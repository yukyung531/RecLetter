export const uploadFile = (
    event: any,
    state: React.Dispatch<React.SetStateAction<string>>
) => {
    state('');
    if (event.target.files.length > 1) {
        alert('사진은 최대 1개 까지 첨부가능합니다.');
    } else {
        for (const file of event.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e: any) => {
                const mimeType = e.target.result
                    .split(',')[0]
                    .split(':')[1]
                    .split(';')[0];
                console.log('이미지 타입 : ' + mimeType);
                state(e.target.result);
            };
        }
    }
};
