package com.example.helpdesk.scheduler;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class SlaUtil {

    public LocalDateTime calculateSla(LocalDateTime from, String priority) {

        return switch (priority.toUpperCase()) {
            case "HIGH" -> from.plusHours(2);
            case "MEDIUM" -> from.plusHours(4);
            case "LOW" -> from.plusHours(8);
            default -> from.plusHours(4);
        };
    }
}
