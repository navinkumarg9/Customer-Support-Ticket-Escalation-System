package com.example.helpdesk.controller;

import com.example.helpdesk.dto.LoginRequest;
import com.example.helpdesk.dto.SignupRequest;
import com.example.helpdesk.model.User;
import com.example.helpdesk.repository.UserRepository;
import com.example.helpdesk.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // ================= SIGNUP =================
    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest request) {

        // Email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "User already exists";
        }

        // Normalize role (Agent -> AGENT)
        String role = request.getRole().toUpperCase();

        // Strict role validation
        if (!role.equals("ADMIN") && !role.equals("AGENT") && !role.equals("USER")) {
            return "Invalid role. Allowed roles: Agent, User";
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        // AGENT → Pending approval
        if (role.equals("AGENT")) {
            user.setStatus("PENDING");
            userRepository.save(user);

            // Send approval mail ONLY to admin
            emailService.sendAgentApprovalMail(user);

            return "Agent registered. Waiting for admin approval";
        }

        // USER / ADMIN → Active immediately
        user.setStatus("ACTIVE");
        userRepository.save(user);

        return "Signup successful";
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        return userRepository.findByEmail(request.getEmail())
                .map(user -> {

                    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        return ResponseEntity
                                .status(401)
                                .body(Map.of("message", "Invalid password"));
                    }

                    if (!"ACTIVE".equals(user.getStatus())) {
                        return ResponseEntity
                                .status(403)
                                .body(Map.of("message", "Account not approved yet"));
                    }

                    return ResponseEntity.ok(
                            Map.of(
                                    "id", user.getId(),
                                    "fullName", user.getFullName(),
                                    "email", user.getEmail(),
                                    "role", user.getRole()
                            )
                    );
                })
                .orElseGet(() ->
                        ResponseEntity
                                .status(404)
                                .body(Map.of("message", "User not found"))
                );
    }

}
