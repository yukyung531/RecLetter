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
    studioId: number;
    studioTitle: string;
    isCompleted: boolean;
    isStudioOwner: boolean;
    hasMyClip: boolean;
    thumbnailUrl: string;
    expireDate: Date;
}

export interface StudioDetail {
    studioId: string;
    studioTitle: string;
    isCompleted: boolean;
    studioOwner: string;
    clipInfoList: ClipInfo[];
    studioFrameId: number;
    studioFontId: number;
    studioBGMId: number;
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
    unusedClipList: string[];
    studioFrameId: string;
    studioFont: FontType;
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

export interface FrameType {
    frameId: number;
    frameTitle: string;
    thumbnail: string;
    frameBody: string;
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
