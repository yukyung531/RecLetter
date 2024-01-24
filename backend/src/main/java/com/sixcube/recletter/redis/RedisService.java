package com.sixcube.recletter.redis;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisService {
    private final RedisTemplate<String, Object> redisTemplate;

    // Redis에 객체 저장
    public void setValues(String key, Object data) {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
        values.set(key, data);
    }

    // Redis에 객체 저장(만료 시간 함께 저장, 해당 시간이 지나면 자동으로 key-value 쌍 삭제)
    public void setValues(String key, Object data, Duration duration) {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
        values.set(key, data, duration);
    }

    // Redis에서 객체 조회
    @Transactional(readOnly = true)
    public Object getValues(String key) {
        ValueOperations<String, Object> values = redisTemplate.opsForValue();
        if (values.get(key) == null) {
            return "false";
        }
        return values.get(key);
    }

    //Redis에서 key-value 쌍 삭제
    public void deleteValues(String key) {
        redisTemplate.delete(key);
    }

    // key에 대한 만료 시간을 설정 (해당 시간이 지나면 자동으로 key-value 쌍 삭제)
    public void expireValues(String key, int timeout) {
        redisTemplate.expire(key, timeout, TimeUnit.MILLISECONDS);
    }

    public boolean hasKey(String key) {
        return redisTemplate.hasKey(key);
    }

}