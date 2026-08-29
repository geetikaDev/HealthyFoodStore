package com.healthyfoodstore.service.impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.healthyfoodstore.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {
	
	private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendPasswordResetOtp(
            String email,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "Swaad Junction - Password Reset OTP"
        );

        message.setText(
                "Hello,\n\n"
                + "We received a request to reset your "
                + "Swaad Junction account password.\n\n"
                + "Your OTP is: " + otp + "\n\n"
                + "This OTP is valid for 5 minutes.\n\n"
                + "If you did not request a password reset, "
                + "please ignore this email.\n\n"
                + "Regards,\n"
                + "Swaad Junction\n"
                + "Healthy Homemade Snacks & Traditional Indian Foods"
        );

        mailSender.send(message);
    }
}
