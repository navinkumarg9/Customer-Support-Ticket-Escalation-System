package com.example.helpdesk.repository;

import com.example.helpdesk.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Page<Ticket> findByUserId(Long userId, Pageable pageable);

    List<Ticket> findByStatus(String status);

    // ✅ ADD THIS FOR ADMIN PAGINATION
    Page<Ticket> findAll(Pageable pageable);

    Page<Ticket> findByStatus(String status, Pageable pageable);

    List<Ticket> findByAgentIdAndStatusIn(Long agentId, List<String> statuses);

    boolean existsByAgentIdAndStatusIn(Long agentId, List<String> statuses);

    long countByStatus(String status);

    // 🔥 SLA escalation query
    List<Ticket> findBySlaDeadlineBeforeAndStatusNot(
            LocalDateTime time,
            String status
    );
    
}
