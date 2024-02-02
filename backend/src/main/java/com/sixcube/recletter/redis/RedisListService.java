package com.sixcube.recletter.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RedisListService {

    @Autowired
    private ListOperations<String, String> listOperations;

    // 리스트에 값을 추가하는 메서드
    public void addValueToList(String key, String value) {
        listOperations.leftPush(key, value);
    }

    // 리스트에서 값을 삭제하는 메서드
    public void removeValueFromList(String key, String value) {
        listOperations.remove(key, 1, value);
    }

    // 리스트 전체를 가져오는 메서드
    public List<String> getList(String key) {
        return listOperations.range(key, 0, -1);
    }
}