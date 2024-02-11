package com.sixcube.recletter.email.service;

import com.sixcube.recletter.auth.exception.EmailSendException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

/**
 * 이메일 발송을 담당하는 클래스
 */

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender emailSender;
    private final SpringTemplateEngine springTemplateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String toEmail, String title, String code) throws EmailSendException {
        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            helper.setFrom(fromEmail); //yml에서 @Value로 가져온 보내는 송신자 이메일 주소
            helper.setTo(toEmail); //인자로 받은 이메일 수신자 주소
            helper.setSubject(title); //제목
            //helper.setText(text, true); //템플릿 사용으로 주석처리

            //템플릿에 전달할 데이터 설정
            Context context = new Context();
            context.setVariable("code", code); //Template에 전달할 데이터(authKey) 설정
            //메일 내용 설정 : 템플릿 프로세스
            String html = springTemplateEngine.process("mail", context);
            helper.setText(html, true);
            helper.addInline("image", new ClassPathResource("templates/images/image-1.png"));

            emailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new EmailSendException();
        }
    }

}
