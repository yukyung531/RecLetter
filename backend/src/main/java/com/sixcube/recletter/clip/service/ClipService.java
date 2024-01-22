package com.sixcube.recletter.clip.service;


import com.sixcube.recletter.clip.dto.Clip;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ClipService
{
    public void createClip(Clip clip, MultipartFile file);

    public void updateClip(Clip clip);

    public void deleteClip(int clipId);

    public Clip searchClip(int clipId);

    public boolean isClipOwner(String userId, int clipId);

    public List<Clip> searchStudioClipList(String studioId);

}
