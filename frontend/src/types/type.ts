export type ImgFile = {
    url: string;
    example: string;
};


export type StudioInfo = {
    studioId: number,
    studioTitle: string,
    isStudioOwner: boolean,
    studioStatus: boolean,
    thumbnailUrl: string,
    expireDate: Date,
    isUpload: boolean
}
