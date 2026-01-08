package com.example.helpdesk.service;

import com.example.helpdesk.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private BrevoEmailService brevoEmailService;

    private static final String ADMIN_EMAIL =
            "navinkumarg999@gmail.com";

    // ONLY for new AGENT signup
    public void sendAgentApprovalMail(User agent) {

        String subject = "New Agent Approval Required";

        String body =
                "Agent Name: " + agent.getFullName() +
                        "\nAgent Email: " + agent.getEmail() +
                        "\n\nApprove:" +
                        "\nhttps://helpdesk-deployment-latest.onrender.com/api/admin/approve?email=" + agent.getEmail() +
                        "\n\nReject:" +
                        "\nhttps://helpdesk-deployment-latest.onrender.com/api/admin/reject?email=" + agent.getEmail();

        brevoEmailService.sendEmail(
                ADMIN_EMAIL,
                subject,
                body
        );
    }
}
