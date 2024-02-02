package com.sixcube.recletter.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.util.List;

@RequiredArgsConstructor
@Configuration
@EnableRedisRepositories
public class RedisConfiguration {
  private final RedisProperties redisProperties;

  @Bean
  public RedisConnectionFactory redisConnectionFactory() {
    return new LettuceConnectionFactory(redisProperties.getHost(), redisProperties.getPort());
  }

  @Bean
  public RedisTemplate<String, Object> objectRedisTemplate() {
    RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
    redisTemplate.setKeySerializer(new StringRedisSerializer());
    redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
    redisTemplate.setConnectionFactory(redisConnectionFactory());

    return redisTemplate;
  }

  @Bean
  public RedisTemplate<String, List<String>> listRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
    RedisTemplate<String, List<String>> redisTemplate = new RedisTemplate<>();
    redisTemplate.setConnectionFactory(redisConnectionFactory);

    // key의 직렬화 설정
    redisTemplate.setKeySerializer(new StringRedisSerializer());

    // value의 직렬화 설정
    redisTemplate.setValueSerializer(new StringRedisSerializer());

    // hash key와 hash value의 직렬화 설정
    redisTemplate.setHashKeySerializer(new StringRedisSerializer());
    redisTemplate.setHashValueSerializer(new StringRedisSerializer());

    redisTemplate.afterPropertiesSet();
    return redisTemplate;
  }

  @Bean
  public ListOperations<String, String> listOperations(RedisTemplate<String, String> redisTemplate) {
    return redisTemplate.opsForList();
  }


}
