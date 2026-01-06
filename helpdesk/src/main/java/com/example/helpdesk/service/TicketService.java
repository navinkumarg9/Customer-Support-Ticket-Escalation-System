package com.example.helpdesk.service;

import com.example.helpdesk.model.Ticket;
import com.example.helpdesk.model.User;
import com.example.helpdesk.repository.TicketRepository;
import com.example.helpdesk.scheduler.SlaUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final SlaUtil slaUtil;

    public TicketService(TicketRepository ticketRepository, SlaUtil slaUtil) {
        this.ticketRepository = ticketRepository;
        this.slaUtil = slaUtil;
    }

    // ================= USER =================

    public Ticket createTicket(String issue, String priority, User user) {

        // ✅ BACKEND SAFETY CHECK
        if (issue == null || issue.trim().isEmpty()) {
            throw new RuntimeException("Issue description is required");
        }

        if (issue.length() > 5000) {
            throw new RuntimeException("Issue description too long (max 5000 characters)");
        }

        Ticket ticket = new Ticket();
        ticket.setTicketId("TKT-" + (ticketRepository.count() + 1));
        ticket.setIssue(issue);
        ticket.setPriority(priority);
        ticket.setStatus("OPEN");
        ticket.setUserId(user.getId());

        LocalDateTime now = LocalDateTime.now();
        ticket.setCreatedAt(now);
        ticket.setSlaDeadline(
                slaUtil.calculateSla(now, priority)
        );

        return ticketRepository.save(ticket);
    }


    public Page<Ticket> getTicketsByUser(Long userId, int page, int size) {
        return ticketRepository.findByUserId(
                userId,
                PageRequest.of(page, size)
        );
    }

    // ================= AGENT =================

    public Ticket startWork(Long ticketId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!"PENDING".equals(ticket.getStatus())) {
            throw new RuntimeException("Ticket not assigned");
        }

        ticket.setStatus("IN_PROGRESS");
        return ticketRepository.save(ticket);
    }

    public Ticket resolveTicket(Long ticketId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus("RESOLVED");
        ticket.setResolvedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }
}
