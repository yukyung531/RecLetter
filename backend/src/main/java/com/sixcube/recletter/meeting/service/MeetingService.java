package com.sixcube.recletter.meeting.service;

import com.sixcube.recletter.user.dto.User;

public interface MeetingService {
    String initializeSession(String studioId, User user);
    String createConnection(String sessionId, User user);
    void deleteSession(String sessionId, User user);

    String checkSession(String sessionId);
}
