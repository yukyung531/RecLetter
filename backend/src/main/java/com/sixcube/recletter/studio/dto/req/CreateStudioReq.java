package com.sixcube.recletter.studio.dto.req;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.Range;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CreateStudioReq {
  @Builder.Default
  private String studioTitle = "제목없음";

  @Positive
  private Integer studioFrameId;

  @Future
  private LocalDateTime expireDate;
}
