package com.sixcube.recletter.redis;

public enum RedisPrefix {
    REFRESH_TOKEN("loginRefresh:"),
    REGIST("regist:"),
    CHANGE_EMAIL("changeEmail:"),
    RESET_PASSOWRD("resetPassword:"),
    ENCODING("encoding:"),
    STUDIO("studio:");


    private String prefix;

    RedisPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String prefix() {
        return prefix;
    }
}
