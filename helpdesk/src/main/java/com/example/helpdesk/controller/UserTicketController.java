package com.example.helpdesk.controller;

import com.example.helpdesk.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class UserTicketController {

    private final AdminService adminService;

    public UserTicketController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ✅ USER CAN VIEW RESOLVED TICKET DETAILS
    @GetMapping("/ticket/{ticketId}")
    public Map<String, Object> viewTicket(@PathVariable Long ticketId) {
        return adminService.getTicketDetails(ticketId);
    }
}
