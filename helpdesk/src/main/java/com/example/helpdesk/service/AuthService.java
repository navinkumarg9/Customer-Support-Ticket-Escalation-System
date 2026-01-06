package com.example.helpdesk.service;

import com.example.helpdesk.dto.LoginRequest;
import com.example.helpdesk.repository.UserRepository;
import com.example.helpdesk.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String signup(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole().equalsIgnoreCase("AGENT")) {
            user.setStatus("PENDING");
        } else {
            user.setStatus("ACTIVE");
        }

        userRepository.save(user);

        return "Signup successful";
    }

    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (user.getStatus().equals("PENDING")) {
            throw new RuntimeException("Admin approval pending");
        }

        return user;
    }
}
