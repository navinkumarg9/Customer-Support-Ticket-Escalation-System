package com.example.helpdesk.service;

import com.example.helpdesk.model.Ticket;
import com.example.helpdesk.model.User;
import com.example.helpdesk.repository.TicketRepository;
import com.example.helpdesk.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AgentService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public AgentService(TicketRepository ticketRepository,
                        UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public Ticket getAssignedTicket(Long agentId) {
        return ticketRepository.findByAgentIdAndStatusIn(
                agentId,
                List.of("PENDING", "IN_PROGRESS")
        ).stream().findFirst().orElse(null);
    }

    public Ticket startWork(Long ticketId, Long agentId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!agentId.equals(ticket.getAgentId())) {
            throw new RuntimeException("Unauthorized access");
        }

        if (!"PENDING".equals(ticket.getStatus())) {
            throw new RuntimeException("Ticket not in PENDING state");
        }

        ticket.setStatus("IN_PROGRESS");
        return ticketRepository.save(ticket);
    }

    public Ticket resolveTicket(Long ticketId, Long agentId, String note) {

        if (note == null || note.isBlank()) {
            throw new RuntimeException("Resolution note is required");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!agentId.equals(ticket.getAgentId())) {
            throw new RuntimeException("Unauthorized access");
        }

        if (!"IN_PROGRESS".equals(ticket.getStatus())) {
            throw new RuntimeException("Ticket is not in progress");
        }

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        ticket.setAgentId(agent.getId());
        ticket.setAgentName(agent.getFullName());
        ticket.setStatus("RESOLVED");
        ticket.setResolvedAt(Instant.now()); // ✅ UTC
        ticket.setResolutionNote(note);

        return ticketRepository.save(ticket);
    }
}
