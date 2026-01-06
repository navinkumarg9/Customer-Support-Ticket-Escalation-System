package com.example.helpdesk.repository;

import com.example.helpdesk.model.TicketStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketStatusHistoryRepository
        extends JpaRepository<TicketStatusHistory, Long> {

    List<TicketStatusHistory> findByTicketId(Long ticketId);
}
