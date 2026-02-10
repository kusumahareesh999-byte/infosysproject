package com.wellnest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/users")   // ✅ FIXED BASE PATH
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // =========================
    // STEP 1: REGISTER + OTP
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {

        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username already exists"));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already exists"));
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime otpExpiry = LocalDateTime.now().plusMinutes(5);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setOtp(otp);
        user.setOtpExpiry(otpExpiry);
        user.setVerified(false);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        try {
            emailService.sendOTPEmail(email, otp);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to send OTP"));
        }

        return ResponseEntity.ok(Map.of(
                "message", "OTP sent successfully",
                "userId", savedUser.getId()
        ));
    }

    // =========================
    // STEP 2: VERIFY OTP
    // =========================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {

        String userId = body.get("userId");
        String otp = body.get("otp");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!otp.equals(user.getOtp())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid OTP"));
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "OTP expired"));
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Email verified successfully"
        ));
    }

    // =========================
    // STEP 3: HEALTH DETAILS
    // =========================
    @PutMapping("/health/{userId}")
    public ResponseEntity<?> updateHealth(
            @PathVariable String userId,
            @RequestBody Map<String, Object> body) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isVerified()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Verify email first"));
        }

        user.setHeight(getDouble(body.get("height")));
        user.setWeight(getDouble(body.get("weight")));
        user.setAge(getInteger(body.get("age")));
        user.setGender((String) body.get("gender"));
        user.setActivityLevel((String) body.get("activityLevel"));
        user.setHealthGoal((String) body.get("healthGoal"));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Health details saved"
        ));
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String usernameOrEmail = body.get("usernameOrEmail");
        String password = body.get("password");

        User user = userRepository
                .findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isVerified()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email not verified"));
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid password"));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "user", user
        ));
    }

    // =========================
    // HELPERS
    // =========================
    private Double getDouble(Object v) {
        if (v == null) return null;
        return Double.parseDouble(v.toString());
    }

    private Integer getInteger(Object v) {
        if (v == null) return null;
        return Integer.parseInt(v.toString());
    }
}
