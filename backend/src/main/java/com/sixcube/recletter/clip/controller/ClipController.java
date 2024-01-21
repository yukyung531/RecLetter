package com.sixcube.recletter.clip.controller;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;

import static org.springframework.web.servlet.function.RequestPredicates.contentType;

@RestController
@RequestMapping("/clip")
@RequiredArgsConstructor
public class ClipController {

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileName=file.getOriginalFilename();
            String fileUrl= "https://" + bucket + "/test" +fileName;
            ObjectMetadata metadata= new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());
            System.out.println("Ready:"+fileUrl);
            amazonS3Client.putObject(bucket,fileName,file.getInputStream(),metadata);
            System.out.println("fileUpload OK");
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/delete")
    public ResponseEntity<String> deleteFile(@RequestParam("file") String fileName) {
        try {
            System.out.println("Ready to delete:"+fileName);
            amazonS3Client.deleteObject(bucket,fileName);
            System.out.println("fileDelete OK");
            return ResponseEntity.ok(fileName);
        } catch (AmazonServiceException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<String> streamFile(){
        String file="testVideo.mp4";
        String fileUrl= "https://" + bucket + ".s3.ap-northeast-2.amazonaws.com/" +file;
        try{
            System.out.println("Ready to get:"+fileUrl);
            S3Object s3Object = amazonS3Client.getObject(new GetObjectRequest(bucket, file));
            S3ObjectInputStream objectInputStream = s3Object.getObjectContent();
//            byte[] bytes = IOUtils.toByteArray(objectInputStream);
//            System.out.println("get Object OK");
//            HttpHeaders httpHeaders = new HttpHeaders();
//            httpHeaders.setContentType(MediaType.IMAGE_PNG);
//            httpHeaders.setContentLength(bytes.length);
//            String[] arr = fileUrl.split("/");
//            String type = arr[arr.length - 1];
//            String fileName = URLEncoder.encode(type, "UTF-8").replaceAll("\\+", "%20");
//            httpHeaders.setContentDispositionFormData("attachment", fileName); // 파일이름 지정
//            System.out.println("Download OK");
            return ResponseEntity.ok(fileUrl);
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }
    }

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