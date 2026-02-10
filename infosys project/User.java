package com.wellnest;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String username;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    
    // OTP Fields
    private String otp;
    private LocalDateTime otpExpiry;
    private boolean verified;
    
    // Health Details
    private Double height;
    private Double weight;
    private Integer age;
    private String gender;
    private String activityLevel;
    private String healthGoal;
    private Double caloriesBurn;
    private Double bodyFat;
    
    private LocalDateTime createdAt;
}