package com.example.helpdesk.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Data
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String ticketId;   // TKT-101

    // ✅ FIX: allow large issue descriptions
    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String issue;

    @Column(nullable = false)
    private String priority;

    @Column(nullable = false)
    private String status; // OPEN, PENDING, IN_PROGRESS, ESCALATED, RESOLVED

    @Column(nullable = false)
    private Long userId;

    private Long agentId;
    private String agentName;

    private LocalDateTime createdAt;
    private LocalDateTime slaDeadline;
    private LocalDateTime resolvedAt;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String resolutionNote;

    private boolean escalated;
}
