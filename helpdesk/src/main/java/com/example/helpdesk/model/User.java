package com.example.helpdesk.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto increment id
    private Long id;

    private String fullName;
    @Email
    private String email;
    private String password;

    private String role;   // ADMIN | AGENT | USER
    private String status; // ACTIVE | PENDING | REJECTED
}
