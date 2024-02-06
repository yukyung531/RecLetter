package com.sixcube.recletter.clip.service;


import com.sixcube.recletter.clip.dto.Clip;
import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.studio.dto.LetterClipInfo;
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

    public Clip searchMyClip(String userId, int clipId);

    public List<ClipInfo> searchClipInfoList(String studioId);

    public String createSignedClipUrl(String fileName);

    public void updateUsedClip(String studioId, int clipId, int clipOrder, int clipVolume);

    public void updateUnusedClip(String studioId, int clipId);

    public List<LetterClipInfo> searchLetterClipInfoByOrder(String studioId);
}
