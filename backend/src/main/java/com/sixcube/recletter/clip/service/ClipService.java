package com.sixcube.recletter.clip.service;


import com.sixcube.recletter.clip.dto.Clip;
import com.sixcube.recletter.clip.dto.ClipInfo;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ClipService
{
    public void createClip(Clip clip, MultipartFile file);

    public void updateClip(Clip clip, String preTitle, MultipartFile file);

    public void deleteClip(Clip clip);

    public Clip searchClip(int clipId);

    public String searchClipUrl(int clipId);

    public String getFileKey(Clip clip);

    public boolean isClipOwner(String userId, int clipId);

    public List<ClipInfo> searchClipInfoList(String studioId);

}
