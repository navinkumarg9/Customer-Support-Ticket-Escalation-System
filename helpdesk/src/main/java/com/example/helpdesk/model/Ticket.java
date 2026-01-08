package com.example.helpdesk.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Table(name = "tickets")
@Data
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String ticketId;

    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String issue;

    @Column(nullable = false)
    private String priority;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Long userId;

    private Long agentId;
    private String agentName;

    private Instant createdAt;
    private Instant slaDeadline;
    private Instant resolvedAt;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String resolutionNote;

    private boolean escalated;
}
