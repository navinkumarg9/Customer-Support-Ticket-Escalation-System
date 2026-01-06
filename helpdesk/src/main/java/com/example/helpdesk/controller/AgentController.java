package com.example.helpdesk.controller;

import com.example.helpdesk.dto.ResolveTicketRequest;
import com.example.helpdesk.model.Ticket;
import com.example.helpdesk.service.AgentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agent")
@CrossOrigin(origins = "http://localhost:5173")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    // 🔹 Get assigned ticket
    @GetMapping("/ticket/{agentId}")
    public Ticket getMyTicket(@PathVariable Long agentId) {
        return agentService.getAssignedTicket(agentId);
    }

    // 🔹 Start work
    @PostMapping("/start/{ticketId}")
    public Ticket startWork(
            @PathVariable Long ticketId,
            @RequestParam Long agentId
    ) {
        return agentService.startWork(ticketId, agentId);
    }

    // 🔹 Resolve ticket
    @PostMapping("/resolve/{ticketId}")
    public Ticket resolveTicket(
            @PathVariable Long ticketId,
            @RequestBody ResolveTicketRequest request
    ) {
        return agentService.resolveTicket(
                ticketId,
                request.getAgentId(),
                request.getNote()
        );
    }

}
