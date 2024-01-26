export type ImgFile = {
    url: string;
    example: string;
};

// user 타입
export interface RegistUser {
    userId: string;
    userEmail: string;
    userPassword: string;
    userNickname: string;
}
export interface User {
    userId: string;
    userPassword: string;
}
export interface UserInfo {
    userId: string;
    userNickname: string;
}

export interface UserModify {
    userEmail: string;
    userNickname: string;
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
}

export interface StudioInfo {
    studioId: number;
    studioTitle: string;
    isStudioOwner: boolean;
    studioStatus: boolean;
    thumbnailUrl: string;
    expireDate: Date;
    isUpload: boolean;
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
    unusedClipList: string[];
    studioFont: FontType[];
    studioBGM: string;
    studioVolume: number;
}
export interface ClipList {
    clipId: string;
    clipVolume: number;
}
export interface FontType {
    fontId: string;
    fontSize: number;
    isBold: boolean;
}


//template 타입
export interface ScriptTemplate {
    scriptId: number,
    scriptTitle: string,
    scriptContent: string
}
