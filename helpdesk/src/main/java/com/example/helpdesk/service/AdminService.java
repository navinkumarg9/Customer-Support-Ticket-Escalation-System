package com.example.helpdesk.service;

import com.example.helpdesk.model.Ticket;
import com.example.helpdesk.model.User;
import com.example.helpdesk.repository.TicketRepository;
import com.example.helpdesk.repository.UserRepository;
import com.example.helpdesk.scheduler.SlaUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final SlaUtil slaUtil;

    public AdminService(TicketRepository ticketRepository,
                        UserRepository userRepository,
                        SlaUtil slaUtil) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.slaUtil = slaUtil;
    }

    // 🔹 Agent approval
    public void approveAgent(String email) {

        User agent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (!"AGENT".equals(agent.getRole())) {
            throw new RuntimeException("User is not an agent");
        }

        agent.setStatus("ACTIVE");
        userRepository.save(agent);
    }

    // 🔹 Reject agent
    public void rejectAgent(String email) {

        User agent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        userRepository.delete(agent);
    }

    // ✅ ALL TICKETS (PAGINATED)
    public Page<Ticket> getAllTickets(int page, int size) {
        return ticketRepository.findAll(
                PageRequest.of(page, size)
        );
    }

    // ✅ FILTER BY STATUS (PAGINATED)
    public Page<Ticket> getTicketsByStatus(String status, int page, int size) {
        return ticketRepository.findByStatus(
                status,
                PageRequest.of(page, size)
        );
    }

    // 🔹 Dashboard counts
    public Map<String, Long> getDashboardCounts() {

        Map<String, Long> counts = new HashMap<>();
        counts.put("TOTAL", ticketRepository.count());
        counts.put("OPEN", ticketRepository.countByStatus("OPEN"));
        counts.put("PENDING", ticketRepository.countByStatus("PENDING"));
        counts.put("IN_PROGRESS", ticketRepository.countByStatus("IN_PROGRESS"));
        counts.put("ESCALATED", ticketRepository.countByStatus("ESCALATED"));
        counts.put("RESOLVED", ticketRepository.countByStatus("RESOLVED"));

        return counts;
    }

    // 🔹 Agents with availability
    public List<Map<String, Object>> getAgentsWithAvailability() {

        List<User> agents = userRepository.findByRoleAndStatus("AGENT", "ACTIVE");

        return agents.stream().map(agent -> {

            boolean busy = ticketRepository.existsByAgentIdAndStatusIn(
                    agent.getId(),
                    List.of("PENDING", "IN_PROGRESS")
            );

            Map<String, Object> map = new HashMap<>();
            map.put("id", agent.getId());
            map.put("name", agent.getFullName());
            map.put("email", agent.getEmail());
            map.put("busy", busy);

            return map;
        }).toList();
    }

    // 🔹 Assign / Reassign ticket
    public Ticket assignTicketToAgent(Long ticketId, Long agentId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // ✅ Only OPEN or ESCALATED allowed
        if (!List.of("OPEN", "ESCALATED").contains(ticket.getStatus())) {
            throw new RuntimeException("Ticket cannot be assigned");
        }

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        boolean agentBusy = ticketRepository.existsByAgentIdAndStatusIn(
                agentId,
                List.of("PENDING", "IN_PROGRESS")
        );

        if (agentBusy) {
            throw new RuntimeException("Agent already busy");
        }

        // 🔥 RESET STATE
        ticket.setAgentId(agentId);
        ticket.setAgentName(agent.getFullName());
        ticket.setStatus("PENDING");
        ticket.setEscalated(false);

        // 🔥 RESTART SLA
        LocalDateTime now = LocalDateTime.now();
        ticket.setCreatedAt(now);
        ticket.setSlaDeadline(
                slaUtil.calculateSla(now, ticket.getPriority())
        );

        return ticketRepository.save(ticket);
    }

    // 🔹 Ticket details
    public Map<String, Object> getTicketDetails(Long ticketId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        Map<String, Object> data = new HashMap<>();
        data.put("ticketId", ticket.getTicketId());
        data.put("issue", ticket.getIssue());
        data.put("priority", ticket.getPriority());
        data.put("status", ticket.getStatus());
        data.put("userId", ticket.getUserId());
        data.put("createdAt", ticket.getCreatedAt());
        data.put("resolvedAt", ticket.getResolvedAt());
        data.put("resolutionNote", ticket.getResolutionNote());
        data.put("agentId", ticket.getAgentId());
        data.put("agentName", ticket.getAgentName());

        return data;
    }

}
