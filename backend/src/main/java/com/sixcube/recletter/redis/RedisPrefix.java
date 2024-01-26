package com.sixcube.recletter.redis;

public enum RedisPrefix {
    REFRESH_TOKEN("loginRefresh:"),
    REGIST("regist:"),
    RESET_PASSOWRD("resetPassword:")
    ;

    private String prefix;

    RedisPrefix(String prefix) {
        this.prefix=prefix;
    }

    public String prefix() {
        return prefix;
    }
}
