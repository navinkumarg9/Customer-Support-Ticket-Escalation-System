package com.example.helpdesk.dto;

import lombok.Data;

@Data
public class CreateTicketRequest {
    private String issue;
    private String priority;
    private Long userId;
}

