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