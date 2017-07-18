package com.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;

@Service("appMailSender")
public class MailSender {
    Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendMail(String from, String to, String subject, String content){
        try {
            MimeMessage message = javaMailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message);

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // set to html

            logger.info("Send mail to: " + to + "Sending...");
            logger.info("   -sending...");

            javaMailSender.send(message);

            logger.info("   - mail send!");

        } catch (Exception ex) {
            logger.info("   - error in sending email: !"  + ex);
        }

    }
}
