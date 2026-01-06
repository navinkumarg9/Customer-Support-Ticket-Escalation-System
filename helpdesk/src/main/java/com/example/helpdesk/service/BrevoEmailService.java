package com.example.helpdesk.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class BrevoEmailService {

    @Value("${BREVO_API_KEY}")
    private String apiKey;

    @Value("${MAIL_FROM}")
    private String mailFrom;

    private static final String BREVO_URL =
            "https://api.brevo.com/v3/smtp/email";

    public void sendEmail(String to, String subject, String textContent) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, Object> body = new HashMap<>();

        body.put("sender", Map.of(
                "email", mailFrom,
                "name", "Helpdesk System"
        ));

        body.put("to", List.of(
                Map.of("email", to)
        ));

        body.put("subject", subject);
        body.put("textContent", textContent);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        BREVO_URL,
                        request,
                        String.class
                );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException(
                    "Brevo email failed: " + response.getBody()
            );
        }
    }
}
