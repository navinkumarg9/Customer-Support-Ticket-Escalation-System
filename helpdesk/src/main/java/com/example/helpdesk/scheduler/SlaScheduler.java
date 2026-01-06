package com.example.helpdesk.scheduler;

import com.example.helpdesk.model.Ticket;
import com.example.helpdesk.repository.TicketRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SlaScheduler {

    private final TicketRepository ticketRepository;

    public SlaScheduler(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Scheduled(fixedRate = 60000)
    public void escalateTickets() {

        List<Ticket> tickets = ticketRepository.findAll();

        for (Ticket t : tickets) {

            if (
                    !"RESOLVED".equals(t.getStatus()) &&
                            !"ESCALATED".equals(t.getStatus()) &&
                            t.getSlaDeadline().isBefore(LocalDateTime.now())
            ) {
                // 🔥 HARD STATE CHANGE
                t.setStatus("ESCALATED");

                // 🔥 Remove agent (agent must become free)
                t.setAgentId(null);
                t.setAgentName(null);

                t.setEscalated(true);

                ticketRepository.save(t);
            }
        }
    }
}
