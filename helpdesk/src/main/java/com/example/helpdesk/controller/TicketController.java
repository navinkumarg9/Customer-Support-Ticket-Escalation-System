package com.example.helpdesk.controller;

import com.example.helpdesk.dto.AssignTicketRequest;
import com.example.helpdesk.dto.CreateTicketRequest;
import com.example.helpdesk.model.Ticket;
import com.example.helpdesk.model.User;
import com.example.helpdesk.repository.UserRepository;
import com.example.helpdesk.service.TicketService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;

    public TicketController(TicketService ticketService,
                            UserRepository userRepository) {
        this.ticketService = ticketService;
        this.userRepository = userRepository;
    }

    // ✅ Create ticket
    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody CreateTicketRequest request) {
        try {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Ticket ticket = ticketService.createTicket(
                    request.getIssue(),
                    request.getPriority(),
                    user
            );

            return ResponseEntity.ok(ticket);

        } catch (RuntimeException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(ex.getMessage());
        }
    }


    // ✅ User tickets
    @GetMapping("/my/{userId}")
    public Page<Ticket> getMyTickets(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ticketService.getTicketsByUser(userId, page, size);
    }


}
