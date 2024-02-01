package com.sixcube.recletter.studio;

import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.StudioParticipantId;
import com.sixcube.recletter.studio.exception.UserNotInStudioException;
import com.sixcube.recletter.studio.repository.StudioParticipantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class StudioUtil {

    private final StudioParticipantRepository studioParticipantRepository;

    /**
     * 스튜디오에 참가 중인 유저인지 확인
     * @param studioId
     * @param userId
     * @return
     */
    public boolean isStudioParticipant(String studioId, String userId) {
        try {
            studioParticipantRepository.findById(new StudioParticipantId(studioId, userId))
                    .orElseThrow(UserNotInStudioException::new);
        } catch (UserNotInStudioException e){
            return false;
        }
        return true;
    }
}
