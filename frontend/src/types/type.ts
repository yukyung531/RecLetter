export type ImgFile = {
    url: string;
    example: string;
};

export interface StudioInfo {
    studioId: number;
    studioTitle: string;
    isStudioOwner: boolean;
    studioStatus: boolean;
    thumbnailUrl: string;
    expireDate: Date;
    isUpload: boolean;
}

export interface ClipInfo {
    clipId: number;
    clipTitle: string;
    clipOwner: string;
    clipLength: number;
    clipThumbnail: string;
    clipUrl: string;
    clipOrder: number;
    clipVolume: number;
}

export interface StudioDetail {
    studioId: number;
    studioTitle: string;
    studioStatus: boolean;
    studioOwner: string;
    clipInfoList: ClipInfo[];
    studioFrame: number;
    studioFont: number;
    studioBGM: number;
    studioChecklist: number;
}

export interface User {
    userId: string | null;
    userPassword: string | null;
}
export interface LoginInfo {
    userInfo: {
        userId: string;
        userName: string;
    };
    accessToken: string;
    refreshToken: string;
}
