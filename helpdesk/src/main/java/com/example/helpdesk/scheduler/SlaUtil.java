package com.example.helpdesk.scheduler;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class SlaUtil {

    public Instant calculateSla(Instant from, String priority) {

        return switch (priority.toUpperCase()) {
            case "HIGH" -> from.plus(2, ChronoUnit.HOURS);
            case "MEDIUM" -> from.plus(4, ChronoUnit.HOURS);
            case "LOW" -> from.plus(8, ChronoUnit.HOURS);
            default -> from.plus(4, ChronoUnit.HOURS);
        };
    }
}
