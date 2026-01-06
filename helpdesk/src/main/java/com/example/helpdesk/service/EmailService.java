package com.example.helpdesk.service;

import com.example.helpdesk.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final String ADMIN_EMAIL = "navinkumarg999@gmail.com";

    // ONLY for new AGENT signup
    public void sendAgentApprovalMail(User agent) {

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(agent.getEmail());
        msg.setTo(ADMIN_EMAIL);
        msg.setSubject("New Agent Approval Required");

        msg.setText(
                "Agent Name: " + agent.getFullName() +
                        "\nAgent Email: " + agent.getEmail() +
                        "\n\nApprove:" +
                        "\nhttp://localhost:8080/api/admin/approve?email=" + agent.getEmail() +
                        "\n\nReject:" +
                        "\nhttp://localhost:8080/api/admin/reject?email=" + agent.getEmail()
        );

        mailSender.send(msg);
    }
}
