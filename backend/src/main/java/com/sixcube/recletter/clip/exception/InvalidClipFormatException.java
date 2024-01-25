package com.sixcube.recletter.clip.exception;

public class InvalidClipFormatException extends RuntimeException{
     public InvalidClipFormatException(){
        super("저장하려는 파일이 형식에 어긋납니다.");
    }

}
