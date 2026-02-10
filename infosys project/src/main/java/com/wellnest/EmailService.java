package com.wellnest;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    // ✅ Constructor injection (this fixes the error)
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOTPEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("WellNest - Email Verification OTP");
            message.setText(
                "Your OTP for WellNest registration is: " + otp +
                "\n\nThis OTP is valid for 5 minutes."
            );

            mailSender.send(message);
            System.out.println("✅ OTP email sent to: " + toEmail);
        } catch (Exception e) {
            System.out.println("⚠️ Email service not configured - OTP: " + otp + " (for email: " + toEmail + ")");
            System.out.println("⚠️ In development, you can use this OTP to proceed with registration");
            // Don't throw exception in development - allow registration to continue
        }
    }
}
