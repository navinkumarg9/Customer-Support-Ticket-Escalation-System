package com.example.helpdesk.controller;

import com.example.helpdesk.dto.AssignTicketRequest;
import com.example.helpdesk.model.Ticket;
import com.example.helpdesk.model.User;
import com.example.helpdesk.repository.UserRepository;
import com.example.helpdesk.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    public AdminController(AdminService adminService, UserRepository userRepository) {
        this.adminService = adminService;
        this.userRepository = userRepository;
    }



    // ✅ APPROVE AGENT
    @GetMapping("/approve")
    public String approveAgent(@RequestParam String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus("ACTIVE");
        userRepository.save(user);

        return "✅ Agent approved successfully. You may close this tab.";
    }

    // ❌ REJECT AGENT
    @GetMapping("/reject")
    public String rejectAgent(@RequestParam String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);

        return "❌ Agent rejected successfully. You may close this tab.";
    }

    @GetMapping("/tickets")
    public Page<Ticket> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status
    ) {
        if (status != null && !status.equals("ALL")) {
            return adminService.getTicketsByStatus(status, page, size);
        }
        return adminService.getAllTickets(page, size);
    }

    // ✅ Dashboard counts
    @GetMapping("/dashboard-counts")
    public Map<String, Long> getDashboardCounts() {
        return adminService.getDashboardCounts();
    }

    // ✅ Available agents
    @GetMapping("/agents")
    public List<Map<String, Object>> getAgents() {
        return adminService.getAgentsWithAvailability();
    }

    // ✅ Assign ticket → OPEN → PENDING
    @PostMapping("/assign")
    public Ticket assignTicket(@RequestBody AssignTicketRequest request) {
        return adminService.assignTicketToAgent(
                request.getTicketId(),
                request.getAgentId()
        );
    }

    // ✅ Ticket details
    @GetMapping("/ticket/{id}")
    public Map<String, Object> getTicketDetails(@PathVariable Long id) {
        return adminService.getTicketDetails(id);
    }
}
