package com.example.helpdesk.dto;

import lombok.Data;

@Data
public class AssignTicketRequest {
    private Long ticketId;
    private Long agentId;
}

