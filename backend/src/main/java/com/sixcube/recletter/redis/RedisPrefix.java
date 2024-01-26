package com.sixcube.recletter.redis;

public enum RedisPrefix {
    REFRESH_TOKEN("loginRefresh:"),
    REGIST("regist:"),
    CHANGE_EMAIL("changeEmail:"),
    RESET_PASSOWRD("resetPassword:");

    private String prefix;

    RedisPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String prefix() {
        return prefix;
    }
}
