package com.wellnest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public String welcome() {
        return "WellNest API is running successfully!\n\n" +
               "Available endpoints:\n" +
               "- POST /api/register - Register new user\n" +
               "- POST /api/verify-otp - Verify OTP\n" +
               "- PUT /api/health-details/{userId} - Update health details\n" +
               "- POST /api/login - Login user\n" +
               "- GET /api/health/mongodb - MongoDB health check\n" +
               "\nMongoDB is connected and ready!";
    }
}