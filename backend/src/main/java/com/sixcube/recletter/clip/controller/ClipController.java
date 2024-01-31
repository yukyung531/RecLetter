package com.sixcube.recletter.clip.controller;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.sixcube.recletter.clip.dto.Clip;
import com.sixcube.recletter.clip.dto.req.CreateClipReq;
import com.sixcube.recletter.clip.dto.req.UpdateClipReq;
import com.sixcube.recletter.clip.dto.res.SearchClipInfoListRes;
import com.sixcube.recletter.clip.dto.res.SearchClipRes;
import com.sixcube.recletter.clip.service.ClipService;
import com.sixcube.recletter.user.dto.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/clip")
@RequiredArgsConstructor
@Slf4j
public class ClipController {

    private final ClipService clipService;

//    private final String cloudFront="https://d3f9xm3snzk3an.cloudfront.net/";

    @Value("${AWS_FRONT}")
    private String cloudFront;
    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @PostMapping()
    public ResponseEntity<Void> createClip(@ModelAttribute CreateClipReq createClipReq, @AuthenticationPrincipal User user) {

        log.debug(createClipReq.getClip().getContentType());

        Clip clip=Clip.builder()
                .clipOwner(user.getUserId())
                .studioId(createClipReq.getStudioId())
                .clipTitle(createClipReq.getClipTitle())
                .clipContent(createClipReq.getClipContent())
                .clipVolume(100)
                .clipOrder(-1)
                .build();
        log.debug(clip.toString());
        clipService.createClip(clip, createClipReq.getClip());
        return ResponseEntity.ok().build();
    }

    //download 링크에 접속하면 웹에서 저장된 파일을 볼 수 있다!
    @GetMapping("/{clipId}")
    public ResponseEntity<SearchClipRes> searchClip(@PathVariable int clipId, @AuthenticationPrincipal User user) {
        System.out.println(clipId);
        //편집 단계에 들어갈 때 기존 상세 정보 제공
        Clip clip=clipService.searchClip(clipId);
        if(clip==null || !clip.getClipOwner().equals(user.getUserId())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String downloadUrl=cloudFront+clipService.getFileKey(clip);

        SearchClipRes searchClipRes=SearchClipRes.builder()
                .clipId(clip.getClipId())
                .clipTitle(clip.getClipTitle())
                .clipContent(clip.getClipContent())
                .clipDownloadUrl(downloadUrl)
                .build();
        return ResponseEntity.ok(searchClipRes);
    }

    @PutMapping("/{clipId}")
    public ResponseEntity<Void> updateClip(@PathVariable int clipId, @ModelAttribute UpdateClipReq updateClipReq, @AuthenticationPrincipal User user) {

        //본인 영상인지 확인
        System.out.println(clipId);
        Clip clip=clipService.searchClip(clipId);
        if(clip==null || !clip.getClipOwner().equals(user.getUserId())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        //본인 영상이라면 편집
        String prevTitle= clip.getClipTitle();
        clip.setClipTitle(updateClipReq.getClipTitle());
        clip.setClipContent(updateClipReq.getClipContent());

        clipService.updateClip(clip, prevTitle,updateClipReq.getClip());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{clipId}")
    public ResponseEntity<Void> deleteClip(@PathVariable int clipId, @AuthenticationPrincipal User user) {
        //본인 영상인지 확인
        System.out.println(clipId);
        Clip clip=clipService.searchClip(clipId);
        if(clip==null || !clip.getClipOwner().equals(user.getUserId())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        clipService.deleteClip(clip);

        //본인 영상이라면 삭제

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{clipId}/thumbnail")
    public ResponseEntity<String> searchClipThumbnail(@PathVariable int clipId) {
        String clipUrl=clipService.searchClipUrl(clipId);
        return ResponseEntity.ok(clipUrl);
    }



/************************************/

    @GetMapping("/url/{title}")
    public ResponseEntity<Map> getPresignedUrl(@PathVariable String title){
        Map<String,Object> res=new HashMap<>();
        res.put("title",title);
        res.put("url",clipService.getPreSignedUrl(title));
        return ResponseEntity.ok(res);
    }



    //studioId에 따른 clipInfoList 조회 테스트
    @GetMapping("/studio/{studioId}")
    public ResponseEntity<SearchClipInfoListRes> searchClipInfoList(@PathVariable String studioId) {
        System.out.println(studioId);
        //편집 단계에 들어갈 때 기존 상세 정보 제공
        SearchClipInfoListRes clipInfoListRes=new SearchClipInfoListRes();
        clipInfoListRes.setClipInfoList(clipService.searchClipInfoList(studioId));

        return ResponseEntity.ok(clipInfoListRes);
    }



    //데이터를 웹에서 접근할 수 있는 링크 반환
    @GetMapping
    public ResponseEntity<Map> streamFile(){
        String file="testVideo.mp4";
        String fileUrl= "https://" + bucket + ".s3.ap-northeast-2.amazonaws.com/" +file;
        String fileUrl2="https://d3f9xm3snzk3an.cloudfront.net/"+file;
        Map<String, String> result=new HashMap<>();
        result.put("fileUrl",fileUrl2);
        try{
            System.out.println("Ready to get:"+fileUrl);
            S3Object s3Object = amazonS3Client.getObject(new GetObjectRequest(bucket, file));
            return ResponseEntity.ok(result);
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }
    }

    //테스트를 위한 다운로드 api (s3공부)
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadFile(@RequestParam("file") String file){
        String fileUrl= "https://" + bucket + ".s3.ap-northeast-2.amazonaws.com/" +file;
        try{
            System.out.println("Ready to download:"+fileUrl);
            S3Object s3Object = amazonS3Client.getObject(new GetObjectRequest(bucket, file));
            S3ObjectInputStream objectInputStream = s3Object.getObjectContent();
            byte[] bytes = IOUtils.toByteArray(objectInputStream);
            System.out.println("get Object OK");
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setContentType(MediaType.IMAGE_PNG);
            httpHeaders.setContentLength(bytes.length);
            String[] arr = fileUrl.split("/");
            String type = arr[arr.length - 1];
            String fileName = URLEncoder.encode(type, "UTF-8").replaceAll("\\+", "%20");
            httpHeaders.setContentDispositionFormData("attachment", fileName); // 파일이름 지정
            System.out.println("Download OK");
            return new ResponseEntity<>(bytes, httpHeaders, HttpStatus.OK);
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }

    }
}