package com.sixcube.recletter.studio.repository;

import com.sixcube.recletter.RecLetterApplication;
import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.user.dto.User;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.event.annotation.AfterTestClass;
import org.springframework.test.context.event.annotation.BeforeTestClass;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@ContextConfiguration(classes = RecLetterApplication.class)
@ActiveProfiles("test")
class StudioRepositoryTest {

  @Autowired
  private StudioRepository studioRepository;

  @Autowired
  private EntityManager entityManager;

  private User testUser;

  @BeforeEach
  void createTestUser() {
    testUser = User.builder()
        .userId("testUser")
        .userEmail("test@ssafy.com")
        .userPassword("unEncodedTestPassword")
        .userNickname("test")
        .createdAt(LocalDateTime.now())
        .build();

    entityManager.persist(testUser);
    entityManager.flush();
  }

  @AfterEach
  void deleteTestUser() {
    entityManager.remove(testUser);
    entityManager.flush();
  }

  @Test
  @DisplayName("StudioRepository: 스튜디오 생성 테스트")
  void studioSaveTest() {
    LocalDateTime expireDate = LocalDateTime.now().plusDays(14);

    Studio inputStudio = Studio.builder()
        .studioOwner(testUser)
        .studioTitle("TestStudio")
        .expireDate(expireDate)
        .build();

    Studio outputStudio = studioRepository.save(inputStudio);

    System.out.println("inputStudio: " + inputStudio);
    System.out.println("outputStudio: " + outputStudio);
    Assertions.assertEquals(inputStudio.getStudioOwner().getUserId(), outputStudio.getStudioOwner().getUserId());
    Assertions.assertEquals(inputStudio.getExpireDate(), outputStudio.getExpireDate());
    Assertions.assertEquals(inputStudio.getStudioTitle(), outputStudio.getStudioTitle());

  }

}
