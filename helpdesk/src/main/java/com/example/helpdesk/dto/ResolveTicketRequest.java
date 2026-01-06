package com.example.helpdesk.dto;

import lombok.Getter;

@Getter
public class ResolveTicketRequest {
    private Long agentId;
    private String note;

}
