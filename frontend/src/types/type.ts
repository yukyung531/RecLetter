export type ImgFile = {
    url: string;
    example: string;
};

// user 타입
export interface RegistUser {
    userEmail: string;
    userPassword: string;
    userNickname: string;
}
export interface User {
    userEmail: string;
    userPassword: string;
}
export interface UserInfo {
    userId: string;
    userNickname: string;
    userEmail: string;
}

export interface UserModify {
    userNickname: string;
}

export interface EmailSend {
    userEmail: string;
}

export interface PasswordChange {
    originalPassword: string;
    newPassword: string;
}

export interface PasswordReset {
    userEmail: string;
}

export interface EmailRequest {
    userEmail: string;
    code: string;
}
export interface PasswordCode {
    userEmail: string;
    code: string;
}

/** 새로운 비밀번호 재설정 타입 */
export interface NewPassword {
    userEmail: string;
    newPassword: string;
}

export interface tokenType {
    refreshToken: string | null;
}

// studio 타입
export interface StudioMake {
    studioTitle: string;
    expireDate: string;
    studioFrameId: number;
}

export interface StudioInfo {
    studioId: string;
    studioTitle: string;
    studioStatus: string;
    isStudioOwner: boolean;
    hasMyClip: boolean;
    thumbnailUrl: string;
    expireDate: Date;
    videoCount: number;
    attendMember: number;
    studioFrameId: number;
    studioStickerUrl: string;
}

export interface StudioDetail {
    studioId: string;
    studioTitle: string;
    studioStatus: string;
    studioOwner: string;
    clipInfoList: ClipInfo[];
    studioFrameId: number;
    studioBGMId: number;
    studioBGMVolume: number;
    studioStickerUrl: string;
    expireDate: Date;
    // studioChecklist: number;
}
// clip 타입
export interface ClipInfo {
    clipId: number;
    clipTitle: string;
    clipOwner: string;
    clipLength: number;
    clipThumbnail: string;
    clipUrl: string;
    clipOrder: number;
    clipVolume: number;
    clipContent: string;
}
export interface ClipUpload {
    studioId: string;
    clipTitle: string;
    clipContent: string;
    clip: FormData;
}
export interface ClipModify {
    clipTitle: string;
    clipContent: string;
    clip: string;
}

// letter 타입
export interface Letter {
    studioId: string;
    usedClipList: ClipList[];
    unusedClipList: number[];
    studioFrameId: number;
    studioBgmId: number;
    studioBgmVolume: number;
    studioSticker: string;
}
export interface ClipList {
    clipId: number;
    clipVolume: number;
}
export interface FontType {
    fontId: string;
    fontSize: number;
    isBold: boolean;
}

export interface FrameType {
    frameId: number;
    frameTitle: string;
    fontId: number;
    fontSize: string;
    fontBold: string;
}

//template 타입
export interface ScriptTemplate {
    scriptId: number;
    scriptTitle: string;
    scriptContent: string;
}

export interface fontTemplate {
    fontId: number;
    fontTitle: string;
    fontFamily: string;
    fontUrl: string;
}

export interface BGMTemplate {
    bgmId: number;
    bgmTitle: string;
    bgmUrl: string;
}

export interface CanvasFont {
    fontContent: string;
    fontSize: number;
    fontColor: string;
    fontFamily: string;
    fontBorder: string;
    fontBorderWidth: number;
    fontShadow: string;
    fontShadowWidth: number;
    fontShadowBlur: number;
}
