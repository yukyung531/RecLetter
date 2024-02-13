package com.sixcube.recletter.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sixcube.recletter.studio.dto.res.LetterVideoRes;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class KafkaMessageDeserializer extends ErrorHandlingDeserializer<LetterVideoRes> implements
    Deserializer<LetterVideoRes> {

  @Override
  public void configure(Map<String, ?> map, boolean b) {
  }

  @Override
  public LetterVideoRes deserialize(String s, byte[] bytes) {
    log.info(Arrays.toString(bytes));
    if (bytes == null) {
      return null;
    }
    ObjectMapper objectMapper = new ObjectMapper();
    try {
      return objectMapper.readValue(new String(bytes,
          StandardCharsets.UTF_8), LetterVideoRes.class);
    } catch (Exception e) {
      throw new SerializationException("Error when deserializing byte[] to LetterVideoRes");
    }
  }

  @Override
  public void close() {
  }
}