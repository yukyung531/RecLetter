import { StudioInfo } from "../types/type";
 
export const studioList: StudioInfo[] = [
    {
        studioId: 1,
        studioTitle: 'studio1',
        isStudioOwner: false,
        studioStatus: false,
        thumbnailUrl: "/src/assets/images/nothumb.png",
        expireDate: new Date(2024, 0, 25),
        isUpload: true
    },
    {
        studioId: 2,
        studioTitle: 'studio2',
        isStudioOwner: true,
        studioStatus: false,
        thumbnailUrl: "/src/assets/images/nothumb.png",
        expireDate: new Date(2024, 0, 25),
        isUpload: false
    },
    {
        studioId: 3,
        studioTitle: 'studio3',
        isStudioOwner: true,
        studioStatus: false,
        thumbnailUrl: "/src/assets/images/nothumb.png",
        expireDate: new Date(2024, 0, 21),
        isUpload: true
    },
    {
        studioId: 4,
        studioTitle: 'studio4',
        isStudioOwner: true,
        studioStatus: true,
        thumbnailUrl: "/src/assets/images/nothumb.png",
        expireDate: new Date(2024, 0, 21),
        isUpload: true
    },
];