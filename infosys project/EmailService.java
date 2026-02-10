package com.wellnest;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    public void sendOTPEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("WellNest - Email Verification OTP");
            message.setText(
                "Your OTP for WellNest registration is: " + otp + "\n\n" +
                "This OTP is valid for 5 minutes only.\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Thank you,\n" +
                "WellNest Team"
            );
            
            mailSender.send(message);
            System.out.println("✅ OTP email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email");
        }
    }
}